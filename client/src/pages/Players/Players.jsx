import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader, ErrorState, EmptyState } from '../../components/common/UI';
import { playerService, countryService } from '../../api/services';
import { useToast } from '../../context/ToastContext';
import styles from './Players.module.css';

// ── Transfer History Panel ────────────────────────────────────────────────────

function TransferTimeline({ transfers, loading, error }) {
  if (loading) {
    return (
      <div className={styles.transferLoading}>
        <span className={styles.transferSpinner} />
        <span>Завантаження трансферів…</span>
      </div>
    );
  }

  if (error) {
    return <div className={styles.transferError}>{error}</div>;
  }

  if (!transfers || transfers.length === 0) {
    return <div className={styles.transferEmpty}>Трансферів не знайдено</div>;
  }

  return (
    <div className={styles.timeline}>
      {transfers.map((t, idx) => {
        const date = t.transferDate
          ? new Date(t.transferDate).toLocaleDateString('uk-UA', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—';

        const statusColor =
          t.status === 'confirmed' ? '#4ade80' : t.status === 'pending' ? '#facc15' : '#888';

        return (
          <div key={t.transferId ?? idx} className={styles.timelineItem}>
            {/* Vertical line + dot */}
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot} style={{ borderColor: statusColor }} />
              {idx < transfers.length - 1 && <div className={styles.timelineConnector} />}
            </div>

            {/* Card */}
            <div className={styles.transferCard}>
              <div className={styles.transferDate}>{date}</div>

              <div className={styles.transferTeams}>
                {/* From */}
                <div className={styles.transferTeam}>
                  {t.fromTeam?.logo ? (
                    <img src={t.fromTeam.logo} alt={t.fromTeam.name} className={styles.teamLogo} />
                  ) : (
                    <div className={styles.teamLogoPlaceholder}>?</div>
                  )}
                  <span className={styles.teamName}>{t.fromTeam?.name ?? 'Вільний агент'}</span>
                </div>

                <div className={styles.transferArrow}>
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                    <path
                      d="M0 6H18M18 6L13 1M18 6L13 11"
                      stroke="#a800ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* To */}
                <div className={styles.transferTeam}>
                  {t.toTeam?.logo ? (
                    <img src={t.toTeam.logo} alt={t.toTeam.name} className={styles.teamLogo} />
                  ) : (
                    <div className={styles.teamLogoPlaceholder}>?</div>
                  )}
                  <span className={styles.teamName}>{t.toTeam?.name ?? 'Вільний агент'}</span>
                </div>
              </div>

              {/* Meta row */}
              <div className={styles.transferMeta}>
                <span className={styles.transferStatus} style={{ color: statusColor }}>
                  ●{' '}
                  {t.status === 'confirmed'
                    ? 'Підтверджено'
                    : t.status === 'pending'
                      ? 'В очікуванні'
                      : t.status}
                </span>
                {t.transferFee != null && (
                  <span className={styles.transferFee}>
                    ${Number(t.transferFee).toLocaleString()}
                  </span>
                )}
              </div>

              {t.notes && <p className={styles.transferNotes}>{t.notes}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Transfer Drawer ───────────────────────────────────────────────────────────

function TransferDrawer({ player, onClose }) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!player) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setTransfers([]);

    (async () => {
      try {
        const res = await playerService.getTransfers(player.player_id);
        if (!cancelled) {
          setTransfers(res.data?.data || []);
        }
      } catch {
        if (!cancelled) setError('Не вдалося завантажити трансфери');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [player]);

  if (!player) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.drawerBackdrop} onClick={onClose} />

      {/* Panel */}
      <aside className={styles.drawer}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerPlayerInfo}>
            {player.team_logo && (
              <img src={player.team_logo} alt="" className={styles.drawerAvatar} />
            )}
            <div>
              <div className={styles.drawerNickname}>{player.nickname}</div>
              <div className={styles.drawerRealName}>{player.real_name}</div>
            </div>
          </div>
          <button className={styles.drawerClose} onClick={onClose} aria-label="Закрити">
            ✕
          </button>
        </div>

        <div className={styles.drawerSection}>
          <h2 className={styles.drawerSectionTitle}>
            <span style={{ color: '#a800ff' }}>↔</span> Історія трансферів
          </h2>
          <TransferTimeline transfers={transfers} loading={loading} error={error} />
        </div>
      </aside>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Players() {
  const { addToast } = useToast();
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        const [playersRes, countriesRes] = await Promise.all([
          playerService.getAll(),
          countryService.getAll(),
        ]);

        setPlayers(playersRes.data?.data || []);
        setCountries(countriesRes.data?.data || []);
      } catch (e) {
        setError('Помилка завантаження даних');
        addToast("Не вдалося з'єднатися з сервером", 'error');
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [addToast]);

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesCountry = selectedCountry
        ? player.country === selectedCountry || String(player.country_id) === selectedCountry
        : true;

      const matchesSearch = (player.nickname || player.real_name || '')
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCountry && matchesSearch;
    });
  }, [players, selectedCountry, search]);

  const handleRowClick = useCallback((player) => {
    setSelectedPlayer(player);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedPlayer(null);
  }, []);

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
      <div>
        {/* ── Page header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                margin: 0,
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              Гравці <span style={{ color: '#a800ff' }}>& Статистика</span>
            </h1>
            <p style={{ color: '#666' }}>Аналітика та пошук талантів</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
              }}
            >
              <option value="">Усі країни</option>
              {countries.map((c) => (
                <option key={c.country_id || c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#000',
                color: '#fff',
                border: '1px solid #333',
                width: '200px',
              }}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div
          style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #1a1a1a',
          }}
        >
          {filteredPlayers.length === 0 ? (
            <EmptyState message="Гравців не знайдено" />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#555', borderBottom: '1px solid #1a1a1a' }}>
                  <th style={{ padding: '12px' }}>#</th>
                  <th style={{ padding: '12px' }}>Гравець</th>
                  <th style={{ padding: '12px' }}>Команда</th>
                  <th style={{ padding: '12px' }}>Країна</th>
                  <th style={{ padding: '12px' }}>K/D</th>
                  <th style={{ padding: '12px' }}>Rating</th>
                  <th style={{ padding: '12px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p, idx) => {
                  const kd = (0.8 + Math.random() * 0.7).toFixed(2);
                  const rating = (0.9 + Math.random() * 0.4).toFixed(2);
                  const isSelected = selectedPlayer?.player_id === p.player_id;

                  return (
                    <tr
                      key={p.player_id || idx}
                      className={styles.playerRow}
                      style={{
                        borderBottom: '1px solid #111',
                        color: '#ccc',
                        background: isSelected ? 'rgba(168,0,255,0.06)' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleRowClick(p)}
                    >
                      <td style={{ padding: '12px' }}>{idx + 1}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {p.team_logo && (
                            <img
                              src={p.team_logo}
                              alt=""
                              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                            />
                          )}
                          <div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>{p.nickname}</div>
                            <div style={{ fontSize: '0.8rem', color: '#555' }}>{p.real_name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#a800ff' }}>{p.team || '—'}</td>
                      <td style={{ padding: '12px' }}>{p.country}</td>
                      <td style={{ padding: '12px', color: kd >= 1 ? '#4ade80' : '#ff0055' }}>
                        {kd}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: rating >= 1.1 ? 'rgba(168, 0, 255, 0.2)' : '#1a1a1a',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: rating >= 1.1 ? '1px solid #a800ff' : '1px solid #333',
                          }}
                        >
                          {rating}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={styles.transferHint}>↔ Трансфери</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Transfer Drawer ── */}
      <TransferDrawer player={selectedPlayer} onClose={handleCloseDrawer} />
    </PageLayout>
  );
}
