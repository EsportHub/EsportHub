// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer
      style={{
        marginTop: '5rem',
        padding: '1.8rem 0',
        borderTop: '1px solid var(--border, #111)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#444',
        fontSize: '0.78rem',
      }}
    >
      <div>© 2026 EsportHub</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        All Rights Reserved
        <span>|</span>
        <Link to="/terms" style={{ color: '#444', textDecoration: 'none' }}>
          Terms
        </Link>
        <span>|</span>
        <Link to="/privacy" style={{ color: '#444', textDecoration: 'none' }}>
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
