// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader, Spinner } from '../../components/common/UI';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userService } from '../../api/services';

const GAMES = [
  { id: 'cs2', name: 'CS2', role: 'Sniper' },
  { id: 'dota2', name: 'Dota 2', role: 'Support' },
  { id: 'valorant', name: 'Valorant', role: 'Duelist' },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [favTeams, setFavTeams] = useState([]);
  const [profile, setProfile] = useState({
    nickname: '',
    bio: '',
    game: 'cs2',
    country: 'Ukraine',
  });

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      try {
        const [profRes, favsRes] = await Promise.all([
          userService.getProfile(userId),
          userService.getFavoriteTeams(userId),
        ]);
        const d = profRes.data?.data || profRes.data;
        const favs = favsRes.data?.data || favsRes.data || [];

        setProfile({
          nickname: d.username || user?.name || 'Гравець',
          bio: localStorage.getItem(`bio_${userId}`) || 'Кіберспортсмен. Завжди в грі.',
          game: localStorage.getItem(`game_${userId}`) || 'cs2',
          country: 'Ukraine',
        });
        setFavTeams(Array.isArray(favs) ? favs : []);
      } catch {
        addToast('Помилка завантаження профілю', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const save = async () => {
    setSaving(true);
    try {
      await userService.updateProfile(userId, { username: profile.nickname });
      localStorage.setItem(`bio_${userId}`, profile.bio);
      localStorage.setItem(`game_${userId}`, profile.game);
      updateUser({ name: profile.nickname });
      addToast('Профіль оновлено!', 'success');
      setEditing(false);
    } catch (e) {
      addToast(e.userMessage || 'Помилка збереження', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeTeam = async (teamId) => {
    try {
      await userService.removeFavoriteTeam(userId, teamId);
      setFavTeams((p) => p.filter((t) => (t.team_id || t.id) !== teamId));
      addToast('Команду видалено з обраного', 'success');
    } catch (e) {
      addToast(e.userMessage || 'Помилка видалення', 'error');
    }
  };

  if (loading)
    return (
      <PageLayout>
        <PageLoader />
      </PageLayout>
    );

  const game = GAMES.find((g) => g.id === profile.game);

  return (
    <PageLayout>
      <div style={{ padding: '2rem 0' }}>
        {/* Profile card */}
        <section
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            background: 'linear-gradient(135deg, #0a0a0a, #120021)',
            padding: '3rem',
            borderRadius: 20,
            border: '1px solid #222',
            marginBottom: '3rem',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: '4px solid #a800ff',
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 900,
                boxShadow: '0 0 20px rgba(168,0,255,.2)',
              }}
            >
              {profile.nickname[0]?.toUpperCase()}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                background: '#ffcc00',
                color: '#000',
                fontWeight: 900,
                fontSize: '0.65rem',
                padding: '3px 7px',
                borderRadius: 5,
              }}
            >
              PRO
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  value={profile.nickname}
                  onChange={(e) => setProfile((p) => ({ ...p, nickname: e.target.value }))}
                  style={{
                    background: '#000',
                    border: '1px solid #a800ff',
                    color: '#fff',
                    fontSize: '1.4rem',
                    padding: '8px 12px',
                    borderRadius: 6,
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  {GAMES.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setProfile((p) => ({ ...p, game: g.id }))}
                      style={{
                        background: profile.game === g.id ? 'rgba(168,0,255,.15)' : '#111',
                        border: `1px solid ${profile.game === g.id ? '#a800ff' : '#333'}`,
                        color: profile.game === g.id ? '#fff' : '#666',
                        padding: '6px 14px',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #222',
                    color: '#ccc',
                    padding: '10px',
                    borderRadius: 6,
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>
                    {profile.nickname}
                  </h1>
                  <span
                    style={{
                      background: 'rgba(168,0,255,.1)',
                      border: '1px solid #a800ff',
                      color: '#a800ff',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                    }}
                  >
                    {game?.name}
                  </span>
                </div>
                <p style={{ color: '#888', margin: '0 0 12px' }}>{profile.bio}</p>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#555', fontSize: '0.85rem' }}>
                  <span>📍 {profile.country}</span>
                  <span>🎮 {game?.role}</span>
                </div>
              </>
            )}
          </div>

          <div>
            {editing ? (
              <button
                onClick={save}
                disabled={saving}
                style={{
                  background: '#a800ff',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {saving && <Spinner size={14} color="#fff" />}
                Зберегти
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #a800ff',
                  color: '#a800ff',
                  padding: '10px 20px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Редагувати
              </button>
            )}
          </div>
        </section>

        {/* Favorite teams */}
        <section>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Обрані команди</h2>
          {favTeams.length === 0 ? (
            <p style={{ color: '#555', fontStyle: 'italic' }}>У вас поки немає обраних команд.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem',
              }}
            >
              {favTeams.map((team) => (
                <div
                  key={team.team_id || team.id}
                  style={{
                    background: '#0d0d0d',
                    border: '1px solid #1a1a1a',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: '#a800ff',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#fff',
                        fontSize: '1.1rem',
                      }}
                    >
                      {(team.team_name || team.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {team.team_name || team.name}
                      </div>
                      <div style={{ color: '#a800ff', fontSize: '0.78rem' }}>{team.country}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTeam(team.team_id || team.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#444',
                      cursor: 'pointer',
                      transition: '.2s',
                      padding: 4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
