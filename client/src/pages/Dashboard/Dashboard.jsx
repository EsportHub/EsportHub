import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader, ErrorState } from '../../components/common/UI';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { matchService, tournamentService, countryService } from '../../api/services';

function MatchStatusBadge({ status }) {
  const cfg = {
    live: { label: '● LIVE', bg: '#ff0055', color: '#fff' },
    upcoming: { label: 'НЕЗАБАРОМ', bg: '#1a1a1a', color: '#a800ff' },
    finished: { label: 'ЗАВЕРШЕНО', bg: '#111', color: '#444' },
  };
  const s = cfg[status] || cfg.upcoming;
  return (
    <span
      style={{
        fontSize: '0.55rem',
        fontWeight: 900,
        letterSpacing: '1px',
        padding: '3px 8px',
        borderRadius: '20px',
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

function MatchCard({ match, isSubbed, onNavigate, onReminder }) {
  const t1 =
    match.team1_name ||
    (typeof match.team1 === 'object' ? match.team1?.name : match.team1) ||
    'TBD';
  const t2 =
    match.team2_name ||
    (typeof match.team2 === 'object' ? match.team2?.name : match.team2) ||
    'TBD';
  const status = match.status || 'upcoming';
  const isLive = status === 'live';
  const isFinished = status === 'finished';
  const score1 = match.score_team1 ?? match.scoreTeam1;
  const score2 = match.score_team2 ?? match.scoreTeam2;
  const showScore = isLive || isFinished;
  const time = match.start_time
    ? new Date(match.start_time).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      onClick={onNavigate}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 18px',
        background: isLive ? 'rgba(255,0,85,0.04)' : '#070707',
        borderRadius: '12px',
        border: `1px solid ${isLive ? 'rgba(255,0,85,0.3)' : '#111'}`,
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = isLive ? 'rgba(255,0,85,0.6)' : '#a800ff33')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = isLive ? 'rgba(255,0,85,0.3)' : '#111')
      }
    >
      {}
      {isLive && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: '#ff0055',
          }}
        />
      )}

      {}
      <div style={{ flex: 1, textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#eee', marginBottom: '2px' }}>
          {t1}
        </div>
        {time && !showScore && <div style={{ fontSize: '0.6rem', color: '#333' }}>{time}</div>}
      </div>

      {}
      <div style={{ textAlign: 'center', minWidth: '64px' }}>
        {showScore ? (
          <div
            style={{
              fontWeight: 900,
              fontSize: '1.1rem',
              color: isFinished ? '#555' : '#fff',
              letterSpacing: '2px',
            }}
          >
            {score1} <span style={{ color: '#222' }}>:</span> {score2}
          </div>
        ) : (
          <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#a800ff' }}>VS</div>
        )}
        <div style={{ marginTop: '4px' }}>
          <MatchStatusBadge status={status} />
        </div>
      </div>

      {}
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#eee', marginBottom: '2px' }}>
          {t2}
        </div>
        {time && !showScore && <div style={{ fontSize: '0.6rem', color: '#333' }}>{time}</div>}
      </div>

      {}
      <button
        onClick={onReminder}
        title={isSubbed ? 'Скасувати нагадування' : 'Додати нагадування'}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
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
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryTeams, setCountryTeams] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState({});
  const [tournaments, setTournaments] = useState([]);

  const currentUserId = user?.userId || user?.user_id || user?.id;
  const displayName = user?.username || 's1mple';

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = () => {
    setLoading(true);
    matchService
      .getAll()
      .then((r) => {
        setMatches(r.data?.data || r.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    tournamentService
      .getForMap()
      .then((r) => {
        const raw = r.data;
        let data = [];
        if (Array.isArray(raw)) data = raw;
        else if (Array.isArray(raw?.data)) data = raw.data;
        else if (Array.isArray(raw?.tournaments)) data = raw.tournaments;
        setTournaments(data);
      })
      .catch((err) => console.error('Tournaments load error:', err));
  }, []);

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
    } catch {
      addToast('Не вдалося завантажити команди', 'error');
    }
  };

  const handleTournamentClick = (e, tournament) => {
    if (e?.stopPropagation) e.stopPropagation();
    setSidebarType('tournament');
    setSelectedTournament(tournament);
    setSelectedCountry(null);
    setIsSidebarOpen(true);
  };

  const getTeamName = (m, n) => {
    if (n === 1)
      return m.team1_name || (typeof m.team1 === 'object' ? m.team1?.name : m.team1) || 'TBD';
    return m.team2_name || (typeof m.team2 === 'object' ? m.team2?.name : m.team2) || 'TBD';
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
        setNotifications((prev) => [
          {
            id: Date.now(),
            message: `Ви підписались на матч ${getTeamName(match, 1)} vs ${getTeamName(match, 2)}`,
            created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
        addToast('Ви підписалися на матч!', 'success');
      }
    } catch {
      addToast('Помилка підписки', 'error');
    }
  };

  const allMatches = matches || [];
  const filteredMatches = allMatches.filter((m) => {
    const t1 = getTeamName(m, 1).toLowerCase();
    const t2 = getTeamName(m, 2).toLowerCase();
    return t1.includes(search.toLowerCase()) || t2.includes(search.toLowerCase());
  });
  const sortedTop = [...filteredMatches].sort((a, b) => {
    const order = { live: 0, upcoming: 1, finished: 2 };
    return (order[a.status] ?? 1) - (order[b.status] ?? 1);
  });
  const topMatches = sortedTop.slice(0, 5);
  const hasMore = filteredMatches.length > 5;

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
        {}
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

        {}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '50px' }}>
          {}
          <section>
            {}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2
                  style={{
                    fontSize: '0.75rem',
                    color: '#444',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    margin: 0,
                  }}
                >
                  МАТЧІ СЬОГОДНІ
                </h2>
                {allMatches.some((m) => m.status === 'live') && (
                  <span
                    style={{
                      fontSize: '0.55rem',
                      fontWeight: 900,
                      letterSpacing: '1px',
                      padding: '3px 8px',
                      borderRadius: '20px',
                      background: '#ff0055',
                      color: '#fff',
                      animation: 'pulse 2s infinite',
                    }}
                  >
                    ● LIVE
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="ПОШУК..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #1a1a1a',
                  color: '#fff',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  outline: 'none',
                  width: '120px',
                }}
              />
            </div>

            {error && <ErrorState message={error} onRetry={refetch} />}

            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topMatches.length === 0 && !loading && (
                <div
                  style={{
                    color: '#333',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    padding: '30px 0',
                  }}
                >
                  Матчів не знайдено
                </div>
              )}
              {topMatches.map((m) => {
                const mId = m.matchId || m.match_id || m.id;
                return (
                  <MatchCard
                    key={mId}
                    match={m}
                    isSubbed={!!subscriptions[mId]}
                    onNavigate={() => navigate(`/match/${mId}`)}
                    onReminder={(e) => handleReminder(e, m)}
                  />
                );
              })}
            </div>

            {}
            <button
              onClick={() => navigate('/matches')}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: '1px solid #1a1a1a',
                borderRadius: '10px',
                color: '#a800ff',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'border-color 0.2s, background 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#a800ff';
                e.currentTarget.style.background = 'rgba(168,0,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1a1a1a';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              Дивитися всі матчі
              {hasMore && (
                <span
                  style={{
                    background: '#1a0033',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    fontSize: '0.6rem',
                    color: '#a800ff',
                  }}
                >
                  +{filteredMatches.length - 5}
                </span>
              )}
            </button>
          </section>

          {}
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

        {}
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
            overflowY: 'auto',
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
                {[
                  { label: 'ЛОКАЦІЯ', value: selectedTournament.arena || selectedTournament.city },
                  {
                    label: 'ДИСЦИПЛІНА',
                    value: selectedTournament.game,
                    color: selectedTournament.game === 'CS2' ? '#ff6b35' : '#00e5ff',
                  },
                  {
                    label: 'ПРИЗОВИЙ ФОНД',
                    value: `$${Number(selectedTournament.prize_pool).toLocaleString()}`,
                    color: '#a800ff',
                  },
                  {
                    label: 'ДАТИ',
                    value: `${selectedTournament.start_date} → ${selectedTournament.end_date}`,
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      background: '#0a0a0a',
                      padding: '16px 20px',
                      borderRadius: '8px',
                      border: '1px solid #1a1a1a',
                      marginBottom: '10px',
                    }}
                  >
                    <span
                      style={{
                        color: '#444',
                        display: 'block',
                        fontSize: '0.6rem',
                        letterSpacing: '1px',
                        marginBottom: '5px',
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: color || '#eee' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
