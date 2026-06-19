// src/components/layout/PageLayout.jsx
import Header from './Header';
import { Footer } from './Footer';

export function PageLayout({ children }) {
  return (
    <div
      style={{
        background: 'var(--bg, #000)',
        color: 'var(--text, #fff)',
        minHeight: '100vh',
        padding: '0 4rem',
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
