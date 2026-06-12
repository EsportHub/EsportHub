// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';

const NAV = [
  { to: '/dashboard', label: 'Головна' },
  { to: '/matches', label: 'Матчі' },
  { to: '/teams', label: 'Команди' },
  { to: '/players', label: 'Гравці' },
  { to: '/tournament/1/bracket', label: 'Сітка' },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

const CategoryIcon = ({ type }) => {
  if (type === 'team')
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  if (type === 'player')
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
      </svg>
    );
  if (type === 'tournament')
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    );
  return null;
};

const CATEGORY_LABELS = { team: 'Teams', player: 'Players', tournament: 'Tournaments' };
const CATEGORY_COLORS = { team: '#a800ff', player: '#00c8ff', tournament: '#ffcc00' };

export default function Header({ customActions }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ teams: [], players: [], tournaments: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults({ teams: [], players: [], tournaments: [] });
      setIsOpen(false);
      return;
    }
    setLoading(true);
    apiClient
      .get(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`)
      .then((r) => {
        const d = r.data?.data || {};
        setResults({
          teams: d.teams || [],
          players: d.players || [],
          tournaments: d.tournaments || [],
        });
        setIsOpen(true);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const totalResults = results.teams.length + results.players.length + results.tournaments.length;

  const handleSelect = (item) => {
    setQuery('');
    setIsOpen(false);
    if (item.type === 'team') navigate(`/teams/${item.id}`);
    else if (item.type === 'player') navigate(`/players/${item.id}`);
    else if (item.type === 'tournament') navigate(`/tournament/${item.id}/bracket`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const groups = [
    { key: 'teams', type: 'team', items: results.teams },
    { key: 'players', type: 'player', items: results.players },
    { key: 'tournaments', type: 'tournament', items: results.tournaments },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 0',
          borderBottom: '1px solid var(--border, #222)',
          gap: '1.5rem',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            fontSize: '1.8rem',
            fontWeight: 950,
            background: '#a800ff',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            letterSpacing: '-1px',
            flexShrink: 0,
          }}
        >
          EsportHub
        </div>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {NAV.map(({ to, label }) => {
              const active = pathname === to || (to !== '/dashboard' && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    color: active ? '#a800ff' : 'var(--text, #fff)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 500,
                    opacity: active ? 1 : 0.6,
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = '1')}
                  onMouseLeave={(e) => !active && (e.target.style.opacity = '0.6')}
                >
                  {label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '100%',
                        height: 3,
                        background: '#a800ff',
                        borderRadius: 4,
                        boxShadow: '0 0 10px rgba(168, 0, 255, 0.5)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {!isMobile && (
          <div ref={wrapperRef} style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: focused ? 'rgba(168,0,255,0.06)' : 'var(--bg-secondary, #0d0d0d)',
                border: `1px solid ${focused ? '#a800ff' : 'var(--border, #1f1f1f)'}`,
                borderRadius: 10,
                padding: '0 12px',
                height: 40,
                transition: 'all 0.2s',
                boxShadow: focused ? '0 0 0 3px rgba(168,0,255,0.12)' : 'none',
              }}
            >
              {loading ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a800ff"
                  strokeWidth="2.5"
                  style={{ flexShrink: 0, animation: 'spin 0.8s linear infinite' }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={focused ? '#a800ff' : '#555'}
                  strokeWidth="2.5"
                  style={{ flexShrink: 0, transition: '0.2s' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setFocused(true);
                  if (totalResults > 0) setIsOpen(true);
                }}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Search players, teams, tournaments..."
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text, #fff)',
                  fontSize: '0.85rem',
                  width: '100%',
                  caretColor: '#a800ff',
                }}
              />

              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                    inputRef.current?.focus();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#555',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    transition: '0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {isOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: '#08000f',
                  border: '1px solid #2a0052',
                  borderRadius: 12,
                  zIndex: 99999,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(168,0,255,0.1)',
                  overflow: 'hidden',
                  maxHeight: 420,
                  overflowY: 'auto',
                }}
              >
                {totalResults === 0 && !loading ? (
                  <div
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#444',
                      fontSize: '0.82rem',
                    }}
                  >
                    No results for «{query}»
                  </div>
                ) : (
                  groups.map((group) => (
                    <div key={group.key}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 14px 6px',
                          color: CATEGORY_COLORS[group.type],
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          borderTop: group.key !== groups[0].key ? '1px solid #130025' : 'none',
                        }}
                      >
                        <CategoryIcon type={group.type} />
                        {CATEGORY_LABELS[group.type]}
                        <span
                          style={{
                            marginLeft: 'auto',
                            background: `${CATEGORY_COLORS[group.type]}22`,
                            color: CATEGORY_COLORS[group.type],
                            borderRadius: 4,
                            padding: '1px 6px',
                            fontSize: '0.6rem',
                          }}
                        >
                          {group.items.length}
                        </span>
                      </div>

                      {group.items.map((item) => (
                        <div
                          key={`${group.type}-${item.id}`}
                          onClick={() => handleSelect({ ...item, type: group.type })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '9px 14px',
                            cursor: 'pointer',
                            transition: '0.15s',
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = 'rgba(168,0,255,0.08)')
                          }
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: group.type === 'player' ? '50%' : 8,
                              background: `${CATEGORY_COLORS[group.type]}22`,
                              border: `1px solid ${CATEGORY_COLORS[group.type]}44`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: CATEGORY_COLORS[group.type],
                              flexShrink: 0,
                              overflow: 'hidden',
                            }}
                          >
                            {item.logo ? (
                              <img
                                src={item.logo}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              (item.name || item.nickname || '?')[0].toUpperCase()
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                color: '#eee',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.name || item.nickname}
                            </div>
                            {(item.real_name || item.country) && (
                              <div style={{ color: '#555', fontSize: '0.72rem', marginTop: 1 }}>
                                {item.real_name || item.country}
                              </div>
                            )}
                          </div>

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
                  ))
                )}

                <div
                  style={{
                    padding: '8px 14px',
                    borderTop: '1px solid #130025',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: '#333',
                    fontSize: '0.65rem',
                  }}
                >
                  <kbd
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: 3,
                      padding: '1px 5px',
                      fontSize: '0.6rem',
                      color: '#555',
                    }}
                  >
                    Esc
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-secondary, #1a1a1a)',
              border: '1px solid var(--border, #333)',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.3s',
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#a800ff')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border, #333)')}
          >
            {theme === 'dark' ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffcc00"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="4.22" x2="19.78" y2="5.64" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a800ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {customActions}

          <div
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer', transition: '0.3s transform' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a800ff 0%, #7d00bd 100%)',
                border: '2px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#fff',
                boxShadow: '0 4px 15px rgba(168, 0, 255, 0.3)',
              }}
            >
              {(user?.username || user?.name || 'U')[0].toUpperCase()}
            </div>
          </div>

          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              style={{
                background: 'none',
                border: '1px solid var(--border, #333)',
                borderRadius: 8,
                cursor: 'pointer',
                color: '#fff',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            background: '#08000f',
            border: '1px solid #2a0052',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {/* Mobile search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-secondary, #0d0d0d)',
              border: '1px solid var(--border, #1f1f1f)',
              borderRadius: 10,
              padding: '0 12px',
              height: 40,
              marginBottom: '0.75rem',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2.5"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text, #fff)',
                fontSize: '0.85rem',
                width: '100%',
                caretColor: '#a800ff',
              }}
            />
          </div>

          {NAV.map(({ to, label }) => {
            const active = pathname === to || (to !== '/dashboard' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: active ? '#a800ff' : 'var(--text, #fff)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: active ? 700 : 400,
                  padding: '0.65rem 0.75rem',
                  borderRadius: 8,
                  background: active ? 'rgba(168,0,255,0.1)' : 'transparent',
                  display: 'block',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
