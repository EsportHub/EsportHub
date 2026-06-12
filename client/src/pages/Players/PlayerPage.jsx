import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
const age = (birth) => {
  if (!birth) return null;
  const diff = Date.now() - new Date(birth).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const fmt = (date) =>
  date
    ? new Date(date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

const StatCard = ({ label, value, accent = '#a800ff' }) => (
  <div
    style={{
      background: '#0d000f',
      border: `1px solid ${accent}33`,
      borderRadius: 12,
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent + '99')}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = accent + '33')}
  >
    <span
      style={{
        color: '#555',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
    <span style={{ color: '#eee', fontSize: '1.05rem', fontWeight: 700 }}>{value || '—'}</span>
  </div>
);

const BadgePill = ({ children, color = '#a800ff' }) => (
  <span
    style={{
      background: color + '22',
      border: `1px solid ${color}55`,
      color,
      borderRadius: 20,
      padding: '4px 12px',
      fontSize: '0.72rem',
      fontWeight: 700,
    }}
  >
    {children}
  </span>
);

const Skeleton = ({ w = '100%', h = 16, r = 8 }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: r,
      background: 'linear-gradient(90deg,#1a001f 25%,#2a0040 50%,#1a001f 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }}
  />
);

const KF = `
  @keyframes shimmer { to { background-position: -200% 0; } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow { 0%,100% { box-shadow:0 0 24px rgba(168,0,255,0.25); } 50% { box-shadow:0 0 44px rgba(168,0,255,0.55); } }
`;

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiClient
      .get(`/players/${id}`)
      .then((r) => setPlayer(r.data?.data))
      .catch((e) => setError(e.response?.status === 404 ? 'not_found' : 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const BackBtn = () => (
    <button
      onClick={() => navigate(-1)}
      style={{
        background: 'none',
        border: 'none',
        color: '#555',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.82rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
        padding: 0,
        transition: 'color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#a800ff')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Назад до гравців
    </button>
  );

  if (!loading && error === 'not_found')
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', color: '#555' }}>
        <style>{KF}</style>
        <BackBtn />
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>🕵️</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#eee', marginBottom: 8 }}>
          Гравця не знайдено
        </div>
        <div style={{ fontSize: '0.85rem' }}>ID #{id} не існує або був видалений</div>
      </div>
    );

  if (!loading && error)
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', color: '#555' }}>
        <style>{KF}</style>
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#eee', marginBottom: 16 }}>
          Помилка завантаження
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'rgba(168,0,255,0.15)',
            border: '1px solid #a800ff55',
            borderRadius: 10,
            color: '#a800ff',
            padding: '10px 24px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          Спробувати знову
        </button>
      </div>
    );

  const playerAge = player ? age(player.birth_date) : null;

  return (
    <div
      style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0', animation: 'fadeUp 0.4s ease' }}
    >
      <style>{KF}</style>
      <BackBtn />

      {}
      <div
        style={{
          background: 'linear-gradient(135deg,#0d000f 0%,#110018 60%,#0a000d 100%)',
          border: '1px solid #2a0052',
          borderRadius: 20,
          padding: '2rem',
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(168,0,255,0.12) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {}
        {loading ? (
          <Skeleton w={96} h={96} r={48} />
        ) : (
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#a800ff 0%,#7d00bd 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#fff',
              flexShrink: 0,
              animation: 'glow 3s ease-in-out infinite',
              border: '3px solid rgba(168,0,255,0.4)',
            }}
          >
            {(player?.nickname || '?')[0].toUpperCase()}
          </div>
        )}

        {}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton w="55%" h={28} r={6} />
              <Skeleton w="38%" h={16} r={4} />
              <Skeleton w="28%" h={22} r={20} />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 6,
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize: '1.9rem',
                    fontWeight: 950,
                    color: '#fff',
                    letterSpacing: '-0.5px',
                  }}
                >
                  {player?.nickname}
                </h1>
                {player?.country && <BadgePill color="#00c8ff">{player.country}</BadgePill>}
              </div>

              {player?.real_name && (
                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: 12 }}>
                  {player.real_name}
                  {playerAge && (
                    <span style={{ color: '#444', marginLeft: 8 }}>• {playerAge} р.</span>
                  )}
                </div>
              )}

              {player?.team && (
                <button
                  onClick={() => navigate(`/teams/${player.team_id || ''}`)}
                  style={{
                    background: 'rgba(168,0,255,0.12)',
                    border: '1px solid #a800ff44',
                    borderRadius: 10,
                    padding: '8px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(168,0,255,0.22)';
                    e.currentTarget.style.borderColor = '#a800ff99';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(168,0,255,0.12)';
                    e.currentTarget.style.borderColor = '#a800ff44';
                  }}
                >
                  {player.team_logo ? (
                    <img
                      src={player.team_logo}
                      alt={player.team}
                      style={{ width: 24, height: 24, objectFit: 'contain', borderRadius: 4 }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: '#a800ff33',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#a800ff',
                      }}
                    >
                      {(player.team || '?')[0]}
                    </div>
                  )}
                  <span style={{ color: '#ddd', fontSize: '0.85rem', fontWeight: 700 }}>
                    {player.team}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '1rem',
        }}
      >
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: '#0d000f',
                border: '1px solid #2a005222',
                borderRadius: 12,
                padding: '18px 22px',
              }}
            >
              <Skeleton w="50%" h={10} r={4} />
              <div style={{ marginTop: 10 }}>
                <Skeleton w="70%" h={18} r={4} />
              </div>
            </div>
          ))
        ) : (
          <>
            <StatCard label="Нікнейм" value={player?.nickname} />
            <StatCard label="Справжнє ім'я" value={player?.real_name} accent="#00c8ff" />
            <StatCard label="Дата народження" value={fmt(player?.birth_date)} accent="#00c8ff" />
            <StatCard
              label="Вік"
              value={playerAge ? `${playerAge} років` : null}
              accent="#00c8ff"
            />
            <StatCard label="Країна" value={player?.country} accent="#00c8ff" />
            <StatCard label="Команда" value={player?.team} />
          </>
        )}
      </div>
    </div>
  );
}
