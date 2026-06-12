import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { PageLoader } from '../../components/common/UI';
import { matchService, tournamentService } from '../../api/services';

function StatusBadge({ status }) {
  const cfg = {
    finished: { label: 'ЗАВЕРШЕНО', bg: '#111', color: '#444' },
    live: { label: '● LIVE', bg: '#ff0055', color: '#fff' },
    upcoming: { label: 'НЕЗАБАРОМ', bg: '#1a0033', color: '#a800ff' },
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
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

function MatchCard({ match, onClick }) {
  const date = match.startTime
    ? new Date(match.startTime).toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';
  const time = match.startTime
    ? new Date(match.startTime).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        background: '#070707',
        borderRadius: '12px',
        border: '1px solid #111',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#a800ff44')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#111')}
    >
      {}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}
      >
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#eee' }}>
            {match.team1?.name || 'TBD'}
          </div>
        </div>
        {match.team1?.logo ? (
          <img
            src={match.team1.logo}
            alt=""
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'contain',
              background: '#111',
            }}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '1px solid #222',
            }}
          />
        )}
      </div>

      {}
      <div style={{ textAlign: 'center', minWidth: '100px' }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: '1.2rem',
            color: '#fff',
            letterSpacing: '3px',
            marginBottom: '4px',
          }}
        >
          {match.team1?.score ?? 0} <span style={{ color: '#222' }}>:</span>{' '}
          {match.team2?.score ?? 0}
        </div>
        <StatusBadge status={match.status} />
        <div style={{ fontSize: '0.6rem', color: '#333', marginTop: '4px' }}>
          {date} {time}
        </div>
      </div>

      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {match.team2?.logo ? (
          <img
            src={match.team2.logo}
            alt=""
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'contain',
              background: '#111',
            }}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '1px solid #222',
            }}
          />
        )}
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#eee' }}>
          {match.team2?.name || 'TBD'}
        </div>
      </div>
    </div>
  );
}

export default function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  const [yearFilter, setYearFilter] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('');
  const [page, setPage] = useState(1);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

  useEffect(() => {
    tournamentService
      .getAll()
      .then((r) => {
        const data = r.data?.data || r.data || [];
        setTournaments(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const loadMatches = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (yearFilter) params.year = yearFilter;
    if (tournamentFilter) params.tournamentId = tournamentFilter;

    matchService
      .getArchive(params)
      .then((r) => {
        setMatches(r.data?.data || []);
        setPagination(r.data?.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [yearFilter, tournamentFilter, page]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleYearChange = (v) => {
    setYearFilter(v);
    setPage(1);
  };
  const handleTournamentChange = (v) => {
    setTournamentFilter(v);
    setPage(1);
  };
  const handleReset = () => {
    setYearFilter('');
    setTournamentFilter('');
    setPage(1);
  };

  const hasFilters = yearFilter || tournamentFilter;

  return (
    <PageLayout>
      <div style={{ padding: '2rem 0' }}>
        {}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-1px',
            }}
          >
            Архів <span style={{ color: '#a800ff' }}>Матчів</span>
          </h1>
          <p style={{ margin: '10px 0 0 0', color: '#444', fontSize: '0.9rem' }}>
            {pagination.total > 0 ? `${pagination.total} матчів знайдено` : 'Завершені матчі'}
          </p>
        </div>

        {}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: '20px',
            background: '#070707',
            borderRadius: '12px',
            border: '1px solid #111',
          }}
        >
          <span
            style={{
              color: '#333',
              fontSize: '0.65rem',
              fontWeight: 900,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginRight: '4px',
            }}
          >
            ФІЛЬТРИ
          </span>

          {}
          <select
            value={yearFilter}
            onChange={(e) => handleYearChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">Всі роки</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {}
          <select
            value={tournamentFilter}
            onChange={(e) => handleTournamentChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">Всі турніри</option>
            {tournaments.map((t) => (
              <option key={t.tournament_id || t.id} value={t.tournament_id || t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {}
          {hasFilters && (
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid #1a1a1a',
                borderRadius: '8px',
                color: '#555',
                padding: '8px 14px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ✕ Скинути
            </button>
          )}

          {}
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {yearFilter && (
              <span style={chipStyle}>
                📅 {yearFilter}
                <button onClick={() => handleYearChange('')} style={chipBtnStyle}>
                  ✕
                </button>
              </span>
            )}
            {tournamentFilter &&
              tournaments.find(
                (t) => String(t.tournament_id || t.id) === String(tournamentFilter),
              ) && (
                <span style={chipStyle}>
                  🏆{' '}
                  {
                    tournaments.find(
                      (t) => String(t.tournament_id || t.id) === String(tournamentFilter),
                    )?.name
                  }
                  <button onClick={() => handleTournamentChange('')} style={chipBtnStyle}>
                    ✕
                  </button>
                </span>
              )}
          </div>
        </div>

        {}
        {loading ? (
          <PageLoader />
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#333' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎮</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Матчів не знайдено</div>
            {hasFilters && (
              <button
                onClick={handleReset}
                style={{
                  marginTop: '16px',
                  background: 'transparent',
                  border: '1px solid #a800ff',
                  borderRadius: '8px',
                  color: '#a800ff',
                  padding: '8px 20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Скинути фільтри
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {matches.map((m) => (
              <MatchCard
                key={m.matchId}
                match={m}
                onClick={() => navigate(`/match/${m.matchId}`)}
              />
            ))}
          </div>
        )}

        {}
        {pagination.pages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '32px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ ...pageBtn, opacity: page === 1 ? 0.3 : 1 }}
            >
              ←
            </button>

            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, pagination.pages - 4)) + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    ...pageBtn,
                    background: p === page ? '#a800ff' : 'transparent',
                    color: p === page ? '#fff' : '#555',
                    borderColor: p === page ? '#a800ff' : '#1a1a1a',
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              style={{ ...pageBtn, opacity: page === pagination.pages ? 0.3 : 1 }}
            >
              →
            </button>

            <span style={{ color: '#333', fontSize: '0.7rem', marginLeft: '8px' }}>
              {page} / {pagination.pages}
            </span>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

const selectStyle = {
  background: '#0a0a0a',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  color: '#eee',
  padding: '8px 14px',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
  fontFamily: 'inherit',
  minWidth: '140px',
};

const chipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: '#1a0033',
  border: '1px solid #a800ff44',
  borderRadius: '20px',
  color: '#a800ff',
  padding: '4px 10px',
  fontSize: '0.65rem',
  fontWeight: 700,
};

const chipBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#a800ff',
  cursor: 'pointer',
  padding: '0',
  fontSize: '0.7rem',
  lineHeight: 1,
};

const pageBtn = {
  background: 'transparent',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  color: '#555',
  width: '36px',
  height: '36px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: 700,
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
