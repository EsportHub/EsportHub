// src/components/layout/Header.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV = [
  { to: '/dashboard', label: 'Головна' },
  { to: '/tournaments', label: 'Турніри' },
  { to: '/teams', label: 'Команди' },
  { to: '/players', label: 'Гравці' },
];

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.2rem 0',
        borderBottom: '1px solid var(--border, #222)',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          fontSize: '1.8rem',
          fontWeight: 950,
          background: ' #a800ff ',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          cursor: 'pointer',
          letterSpacing: '-1px',
        }}
      >
        EsportHub
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '2.5rem' }}>
        {NAV.map(({ to, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                color: active ? '#a800ff' : 'var(--text, #fff)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: active ? 700 : 500,
                opacity: active ? 1 : 0.6,
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

      {/* Action Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        {/* Modern Theme Toggle Button */}
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
            // Sun Icon for Dark Mode
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
            // Moon Icon for Light Mode
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

        {/* Notifications */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text, #fff)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.8 }}
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 8,
              height: 8,
              background: '#ff0055',
              borderRadius: '50%',
              border: '2px solid var(--bg, #000)',
            }}
          />
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            cursor: 'pointer',
            transition: '0.3s transform',
          }}
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
            {/* Використовуємо username згідно зі Swagger */}
            {(user?.username || user?.name || 'U')[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
