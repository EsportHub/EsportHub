import React, { useState, useEffect, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader, ErrorState, EmptyState } from '../../components/common/UI';
import { playerService, countryService } from '../../api/services';
import { useToast } from '../../context/ToastContext';

export default function Players() {
  const { addToast } = useToast();
  const [players, setPlayers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        addToast('Не вдалося з’єднатися з сервером', 'error');
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
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((p, idx) => {
                  const kd = (0.8 + Math.random() * 0.7).toFixed(2);
                  const rating = (0.9 + Math.random() * 0.4).toFixed(2);

                  return (
                    <tr
                      key={p.player_id || idx}
                      style={{ borderBottom: '1px solid #111', color: '#ccc' }}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
