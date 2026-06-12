import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader, ErrorState, EmptyState } from '../../components/common/UI';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { teamService, favoriteService } from '../../api/services';

export default function Teams() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [teamsRes, favsRes] = await Promise.all([
          teamService.getAll(),
          user?.id ? favoriteService.getTeams(user.id) : Promise.resolve({ data: { data: [] } }),
        ]);
        const allTeams = teamsRes.data?.data || teamsRes.data || [];
        const favData = favsRes.data?.data || favsRes.data || [];
        setTeams(Array.isArray(allTeams) ? allTeams : []);
        setFavorites(Array.isArray(favData) ? favData.map((f) => Number(f.team_id || f.id)) : []);
      } catch (e) {
        setError(e.userMessage || 'Помилка завантаження команд');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const toggleFav = async (e, team) => {
    e.stopPropagation();
    if (!user?.id) {
      addToast('Увійдіть, щоб додавати до обраного', 'warning');
      return;
    }
    const id = Number(team.team_id || team.id);
    const isFav = favorites.includes(id);
    try {
      if (isFav) {
        await favoriteService.removeTeam(user.id, id);
        setFavorites((p) => p.filter((f) => f !== id));
        addToast(`Видалено ${team.name} з обраного`, 'success');
      } else {
        await favoriteService.addTeam(user.id, id);
        setFavorites((p) => [...p, id]);
        addToast(`${team.name} додано в обране!`, 'success');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setFavorites((p) => [...p, id]);
        addToast(`${team.name} вже в списку`, 'warning');
      } else {
        addToast(err.userMessage || 'Помилка сервера', 'error');
      }
    }
  };

  const filtered = teams.filter(
    (t) =>
      (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.tag || '').toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <PageLayout>
        <PageLoader />
      </PageLayout>
    );
  if (error)
    return (
      <PageLayout>
        <ErrorState message={error} />
      </PageLayout>
    );

  return (
    <PageLayout>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 640px) {
          .teams-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .teams-search input { width: 100% !important; }
          .teams-search { width: 100% !important; }
        }
      `}</style>
      <div style={{ padding: '2rem 0', animation: 'fadeUp 0.4s ease both' }}>
        <div
          className="teams-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 700 }}>
              Пошук <span style={{ color: '#a800ff' }}>Команд</span>
            </h1>
            <p style={{ color: '#888', marginTop: 8 }}>
              Керуй списком своїх улюблених організацій.
            </p>
          </div>
          <div
            className="teams-search"
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Назва або тег..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: '#000',
                border: '1px solid #333',
                borderRadius: 8,
                padding: '10px 40px 10px 14px',
                color: '#fff',
                width: 280,
                outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#a800ff')}
              onBlur={(e) => (e.target.style.borderColor = '#333')}
            />
            <svg
              style={{ position: 'absolute', right: 12 }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a800ff"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="Команди не знайдено" />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '2rem',
            }}
          >
            {filtered.map((team) => {
              const id = Number(team.team_id || team.id);
              const isFav = favorites.includes(id);
              return (
                <div
                  key={id}
                  style={{
                    position: 'relative',
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: 16,
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    transition: 'all .3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#a800ff';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(168,0,255,.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1a';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <button
                    onClick={(e) => toggleFav(e, team)}
                    style={{
                      all: 'unset',
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      cursor: 'pointer',
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill={isFav ? '#a800ff' : 'none'}
                      stroke={isFav ? '#a800ff' : '#444'}
                      strokeWidth="2"
                      style={{ filter: isFav ? 'drop-shadow(0 0 6px #a800ff)' : 'none' }}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: '#111',
                      border: '2px solid #333',
                      borderRadius: '50%',
                      margin: '0 auto 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      overflow: 'hidden',
                    }}
                  >
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                      />
                    ) : (
                      (team.name?.[0] || '?').toUpperCase()
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: '#fff' }}>
                    {team.name}
                  </h3>
                  <span
                    style={{
                      color: '#a800ff',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      letterSpacing: 1,
                    }}
                  >
                    {team.tag || 'TEAM'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
