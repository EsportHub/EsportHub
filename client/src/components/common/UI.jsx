// src/components/common/UI.jsx
// Spinner, PageLoader, EmptyState, ErrorState, FormField, TextInput, SubmitButton

import React from 'react';

export function Spinner({ size = 32, color = '#a800ff' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      style={{ animation: 'spin .8s linear infinite' }}
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

export function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 16,
        color: '#555',
      }}
    >
      <Spinner size={48} />
      <span style={{ fontSize: '0.85rem' }}>Завантаження...</span>
    </div>
  );
}

export function EmptyState({ message = 'Нічого не знайдено' }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#444' }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#333"
        strokeWidth="1.5"
        style={{ marginBottom: 12 }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <p style={{ margin: 0, fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#ff4466' }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ marginBottom: 12 }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p style={{ margin: '0 0 16px' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'transparent',
            border: '1px solid #ff4466',
            color: '#ff4466',
            padding: '8px 20px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Спробувати знову
        </button>
      )}
    </div>
  );
}

export function FormField({ label, error, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: '0.78rem', color: '#888' }}>{label}</label>}
      {children}
      {hint && !error && <span style={{ fontSize: '0.7rem', color: '#555' }}>{hint}</span>}
      {error && (
        <span
          style={{
            fontSize: '0.72rem',
            color: '#ff4466',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

export function TextInput({ error, style = {}, ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '0.85rem 1rem',
        background: 'var(--input-bg, #120021)',
        border: `1px solid ${error ? '#ff4466' : 'var(--input-border, #120021)'}`,
        borderRadius: 6,
        color: 'var(--text, #fff)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color .2s',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = error ? '#ff4466' : '#a800ff';
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = error ? '#ff4466' : 'var(--input-border, #120021)';
        props.onBlur?.(e);
      }}
    />
  );
}

export function SubmitButton({ children, loading, style = {}, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading}
      {...props}
      style={{
        width: '100%',
        padding: '0.875rem',
        background: loading ? '#6600aa' : '#a800ff',
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background .2s',
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
    >
      {loading && <Spinner size={16} color="#fff" />}
      {loading ? 'Завантаження...' : children}
    </button>
  );
}

export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
      style={{
        background: 'none',
        border: '1px solid #333',
        borderRadius: 6,
        cursor: 'pointer',
        color: '#fff',
        padding: '6px 10px',
        fontSize: '1rem',
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
