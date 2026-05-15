import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader, ErrorState, EmptyState } from '../../components/common/UI';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { matchService, tournamentService, countryService } from '../../api/services';
import { usePolling } from '../../hooks/useApi';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null); // 'country' або 'tournament'

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryTeams, setCountryTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState({});
  const [tournaments, setTournaments] = useState([]);

  const currentUserId = user?.userId || user?.user_id || user?.id;
  const displayName = user?.username || 's1mple';

  const { data: matches, loading, error, refetch } = usePolling(() => matchService.getAll(), 15000);

  // Завантаження турнірів для мапи
  useEffect(() => {
    tournamentService
      .getForMap()
      .then((r) => {
        const data = r.data?.data || r.data || [];
        setTournaments(data);
      })
      .catch((err) => console.error('Tournaments load error:', err));
  }, []);

  // Завантаження підписок користувача
  useEffect(() => {
    if (!currentUserId) return;
    matchService
      .getSubscriptions(currentUserId)
      .then((r) => {
        const d = r.data?.data || r.data || [];
        const map = {};
        d.forEach((s) => {
          const mId = s.match_id || s.matchId || s.id;
          if (mId) map[mId] = true;
        });
        setSubscriptions(map);
      })
      .catch((err) => console.error('Subscriptions load error:', err));
  }, [currentUserId]);

  const handleCountryClick = async (id, name) => {
    setSidebarType('country');
    setSelectedCountry({ id, name });
    setSelectedTournament(null);
    setIsSidebarOpen(true);
    try {
      const r = await countryService.getTeamsByCountry(id);
      setCountryTeams(r.data?.data || r.data || []);
    } catch (err) {
      addToast('Не вдалося завантажити команди', 'error');
    }
  };

  const handleTournamentClick = (e, tournament) => {
    e.stopPropagation();
    setSidebarType('tournament');
    setSelectedTournament(tournament);
    setSelectedCountry(null);
    setIsSidebarOpen(true);
  };

  const getTeamName = (m, n) => {
    if (n === 1)
      return m.team1_name || (typeof m.team1 === 'object' ? m.team1.name : m.team1) || 'TBD';
    return m.team2_name || (typeof m.team2 === 'object' ? m.team2.name : m.team2) || 'TBD';
  };

  const handleReminder = async (e, match) => {
    e.stopPropagation();
    if (!currentUserId) {
      addToast('Будь ласка, увійдіть в акаунт', 'warning');
      return;
    }

    const mId = match.matchId || match.match_id || match.id;
    const isSub = !!subscriptions[mId];

    try {
      if (isSub) {
        await matchService.unsubscribe(currentUserId, mId);
        setSubscriptions((p) => {
          const n = { ...p };
          delete n[mId];
          return n;
        });
        addToast('Нагадування скасовано', 'info');
      } else {
        await matchService.subscribe(currentUserId, mId);
        setSubscriptions((p) => ({ ...p, [mId]: true }));

        const newNotif = {
          id: Date.now(),
          message: `Ви підписались на матч ${getTeamName(match, 1)} vs ${getTeamName(match, 2)}`,
          created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setNotifications((prev) => [newNotif, ...prev]);
        addToast('Ви підписалися на матч!', 'success');
      }
    } catch (err) {
      addToast('Помилка підписки', 'error');
    }
  };

  const filteredMatches = (matches || []).filter((m) => {
    const t1 = getTeamName(m, 1).toLowerCase();
    const t2 = getTeamName(m, 2).toLowerCase();
    return t1.includes(search.toLowerCase()) || t2.includes(search.toLowerCase());
  });

  const HeaderNotificationBell = (
    <div
      style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      onClick={() => setIsNotifOpen(!isNotifOpen)}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke={notifications.length > 0 ? '#a800ff' : '#555'}
        strokeWidth="2"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {notifications.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#ff0055',
            color: '#fff',
            fontSize: '9px',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          {notifications.length}
        </div>
      )}

      {isNotifOpen && (
        <div
          style={{
            position: 'absolute',
            top: '35px',
            right: 0,
            width: '300px',
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            borderRadius: '8px',
            zIndex: 9999,
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 15px',
              borderBottom: '1px solid #1a1a1a',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#a800ff',
              letterSpacing: '1px',
            }}
          >
            ЦЕНТР СПОВІЩЕНЬ
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{ padding: '20px', fontSize: '0.75rem', color: '#444', textAlign: 'center' }}
              >
                Немає нових сповіщень
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ padding: '12px 15px', borderBottom: '1px solid #050505' }}>
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      color: '#eee',
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                    }}
                  >
                    {n.message}
                  </p>
                  <span style={{ color: '#333', fontSize: '0.65rem' }}>{n.created_at}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (loading && !matches)
    return (
      <PageLayout>
        <PageLoader />
      </PageLayout>
    );

  return (
    <PageLayout customHeaderActions={HeaderNotificationBell}>
      <div style={{ padding: '2rem 0' }}>
        {/* ХЕДЕР ДЕШБОРДУ ЗГІДНО СКРІНШОТУ */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '3rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-1px',
            }}
          >
            Вітаємо, гравець <span style={{ color: '#a800ff' }}>{displayName}</span>
          </h1>
          <p style={{ margin: '15px 0 0 0', color: '#666', fontSize: '1.2rem', fontWeight: 500 }}>
            Твій центр кіберспортивної активності на сьогодні.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '50px' }}>
          {/* СПИСОК МАТЧІВ */}
          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  fontSize: '0.75rem',
                  color: '#444',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                СЬОГОДНІШНІ ІГРИ
              </h2>
              <input
                type="text"
                placeholder="ПОШУК..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #1a1a1a',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  outline: 'none',
                }}
              />
            </div>

            {error && <ErrorState message={error} onRetry={refetch} />}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredMatches.map((m) => {
                const mId = m.matchId || m.match_id || m.id;
                const isSubbed = !!subscriptions[mId];
                return (
                  <div
                    key={mId}
                    onClick={() => navigate(`/match/${mId}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.2rem',
                      background: '#070707',
                      borderRadius: '10px',
                      border: '1px solid #111',
                      cursor: 'pointer',
                      transition: '0.2s',
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#eee',
                      }}
                    >
                      {getTeamName(m, 1)}
                    </div>
                    <div
                      style={{
                        width: '60px',
                        textAlign: 'center',
                        color: '#a800ff',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                      }}
                    >
                      VS
                    </div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#eee',
                      }}
                    >
                      {getTeamName(m, 2)}
                    </div>

                    <button
                      onClick={(e) => handleReminder(e, m)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '15px',
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={isSubbed ? '#a800ff' : 'none'}
                        stroke={isSubbed ? '#a800ff' : '#333'}
                        strokeWidth="2.5"
                      >
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* МАПА */}
          <section>
            <h2
              style={{
                fontSize: '0.75rem',
                color: '#444',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '20px',
                letterSpacing: '2px',
              }}
            >
              ГЛОБАЛЬНА АРЕНА
            </h2>
            <div
              style={{
                background: '#04000a',
                border: '1px solid #1a0033',
                borderRadius: '20px',
                padding: '30px',
                position: 'relative',
              }}
            >
              <InteractiveMap
                tournaments={tournaments}
                onCountryClick={handleCountryClick}
                onTournamentClick={handleTournamentClick}
              />
            </div>
          </section>
        </div>

        {/* САЙДБАР */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: isSidebarOpen ? 0 : '-420px',
            width: '400px',
            height: '100vh',
            background: '#050505',
            borderLeft: '1px solid #a800ff',
            zIndex: 10000,
            transition: '0.6s cubic-bezier(0.19, 1, 0.22, 1)',
            padding: '50px 40px',
            boxShadow: '-20px 0 60px rgba(0,0,0,0.9)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900 }}>
              {sidebarType === 'country' ? selectedCountry?.name?.toUpperCase() : 'LAN TOURNAMENT'}
            </h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#444',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sidebarType === 'country' &&
              countryTeams.map((t) => (
                <div
                  key={t.id || t.team_id}
                  style={{
                    padding: '20px',
                    background: '#0a0a0a',
                    borderLeft: '4px solid #a800ff',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {t.name.toUpperCase()}
                </div>
              ))}

            {sidebarType === 'tournament' && selectedTournament && (
              <div style={{ color: '#eee' }}>
                <h4
                  style={{
                    color: '#a800ff',
                    fontSize: '1.2rem',
                    marginBottom: '25px',
                    fontWeight: 800,
                  }}
                >
                  {selectedTournament.name}
                </h4>
                <div
                  style={{
                    background: '#0a0a0a',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #1a1a1a',
                  }}
                >
                  <span
                    style={{
                      color: '#444',
                      display: 'block',
                      fontSize: '0.65rem',
                      marginBottom: '5px',
                    }}
                  >
                    ЛОКАЦІЯ
                  </span>
                  <span style={{ fontSize: '1rem' }}>
                    {selectedTournament.arena || selectedTournament.city}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function InteractiveMap({ tournaments, onCountryClick, onTournamentClick }) {
  return (
    <svg viewBox="0 0 1000 500" style={{ width: '100%', height: 'auto' }}>
      <style>{`
        .land { fill: #120326; stroke: #2a0052; stroke-width: 1.5; transition: 0.4s; cursor: pointer; }
        .land:hover { fill: #1e0540; stroke: #a800ff; }
        .pin { cursor: pointer; fill: #a800ff; }
      `}</style>
      <path
        className="land"
        d="M120,80 C180,60 250,50 320,80 C360,100 380,180 340,250 C310,290 220,320 150,280 C100,240 80,150 120,80 Z"
        onClick={() => onCountryClick(2, 'North America')}
      />
      <path
        className="land"
        d="M480,80 C550,60 630,70 650,140 C660,190 600,220 520,220 C450,220 440,150 480,80 Z"
        onClick={() => onCountryClick(1, 'Europe')}
      />
      <path
        className="land"
        d="M650,70 C750,40 950,60 980,180 C1000,300 850,400 720,380 C650,360 620,250 650,70 Z"
        onClick={() => onCountryClick(3, 'Asia / CIS')}
      />
      {tournaments.map((t) => (
        <circle
          key={t.id || t.tournament_id}
          className="pin"
          cx={t.longitude || Math.random() * 500 + 200}
          cy={t.latitude || Math.random() * 300 + 100}
          r="6"
          onClick={(e) => onTournamentClick(e, t)}
        />
      ))}
    </svg>
  );
}
