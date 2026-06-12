import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
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

const KF = `
  @keyframes shimmer { to { background-position:-200% 0; } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes teamGlow { 0%,100% { box-shadow:0 0 24px rgba(168,0,255,0.2); } 50% { box-shadow:0 0 48px rgba(168,0,255,0.5); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
`;

export default function TeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiClient
      .get(`/teams/${id}`)
      .then((r) => setTeam(r.data?.data))
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
      Назад до команд
    </button>
  );

  if (!loading && error === 'not_found')
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', color: '#555' }}>
        <style>{KF}</style>
        <BackBtn />
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>🏚️</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#eee', marginBottom: 8 }}>
          Команду не знайдено
        </div>
        <div style={{ fontSize: '0.85rem' }}>ID #{id} не існує або була видалена</div>
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

  const players = team?.players || [];

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
            top: -80,
            right: -80,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(168,0,255,0.1) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {}
        {loading ? (
          <Skeleton w={96} h={96} r={14} />
        ) : (
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#a800ff22 0%,#7d00bd22 100%)',
              border: '2px solid #a800ff44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              animation: 'teamGlow 3s ease-in-out infinite',
              overflow: 'hidden',
            }}
          >
            {team?.logo ? (
              <img
                src={team.logo}
                alt={team.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              style={{
                display: team?.logo ? 'none' : 'flex',
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#a800ff',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              {(team?.name || '?')[0].toUpperCase()}
            </div>
          </div>
        )}

        {}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton w="50%" h={28} r={6} />
              <Skeleton w="30%" h={16} r={4} />
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Skeleton w={80} h={24} r={20} />
                <Skeleton w={80} h={24} r={20} />
              </div>
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
                  {team?.name}
                </h1>
                {team?.country && <BadgePill color="#00c8ff">{team.country}</BadgePill>}
                {team?.game && <BadgePill color="#ffcc00">{team.game}</BadgePill>}
              </div>

              {team?.tag && (
                <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: 12 }}>
                  Тег: <span style={{ color: '#a800ff', fontWeight: 700 }}>[{team.tag}]</span>
                </div>
              )}

              {team?.founded && (
                <div style={{ color: '#444', fontSize: '0.8rem' }}>Засновано: {team.founded}</div>
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
          marginBottom: '1.5rem',
        }}
      >
        {loading ? (
          [1, 2, 3].map((i) => (
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
            {team?.tag && <StatCard label="Тег" value={`[${team.tag}]`} />}
            {team?.country && <StatCard label="Країна" value={team.country} accent="#00c8ff" />}
            {team?.game && <StatCard label="Гра" value={team.game} accent="#ffcc00" />}
            {team?.founded && <StatCard label="Рік заснування" value={team.founded} />}
            {players.length > 0 && (
              <StatCard label="Гравців у складі" value={players.length} accent="#00c8ff" />
            )}
          </>
        )}
      </div>

      {}
      {(loading || players.length > 0) && (
        <div>
          <h2
            style={{
              color: '#eee',
              fontSize: '1rem',
              fontWeight: 800,
              marginBottom: '1rem',
              letterSpacing: '0.5px',
            }}
          >
            Склад команди
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {loading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: '#0d000f',
                      border: '1px solid #1a0030',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <Skeleton w={36} h={36} r={18} />
                    <div style={{ flex: 1 }}>
                      <Skeleton w="40%" h={14} r={4} />
                      <div style={{ marginTop: 6 }}>
                        <Skeleton w="25%" h={10} r={4} />
                      </div>
                    </div>
                  </div>
                ))
              : players.map((p) => (
                  <div
                    key={p.player_id || p.id}
                    onClick={() => navigate(`/players/${p.player_id || p.id}`)}
                    style={{
                      background: '#0d000f',
                      border: '1px solid #1a0030',
                      borderRadius: 12,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(168,0,255,0.07)';
                      e.currentTarget.style.borderColor = '#a800ff44';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#0d000f';
                      e.currentTarget.style.borderColor = '#1a0030';
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#a800ff 0%,#7d00bd 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: '#fff',
                        flexShrink: 0,
                      }}
                    >
                      {(p.nickname || '?')[0].toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#eee', fontSize: '0.9rem', fontWeight: 700 }}>
                        {p.nickname}
                      </div>
                      {(p.real_name || p.country) && (
                        <div style={{ color: '#555', fontSize: '0.75rem', marginTop: 2 }}>
                          {p.real_name}
                          {p.real_name && p.country ? ' · ' : ''}
                          {p.country}
                        </div>
                      )}
                    </div>

                    {p.role && <BadgePill color="#a800ff">{p.role}</BadgePill>}

                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#333"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
