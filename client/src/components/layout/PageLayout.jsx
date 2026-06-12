// src/components/layout/PageLayout.jsx
import React from 'react';
import Header from './Header';
import { Footer } from './Footer';

export function PageLayout({ children }) {
  return (
    <div
      style={{
        background: 'var(--bg, #000)',
        color: 'var(--text, #fff)',
        minHeight: '100vh',
        padding: '0 clamp(1rem, 5vw, 4rem)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
