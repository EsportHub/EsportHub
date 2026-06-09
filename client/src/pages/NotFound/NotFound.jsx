// src/pages/NotFound/NotFound.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate, isAuthenticated]);

  const handleBack = () => {
    // Use History API — go back if there's history, else go home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
    }
  };

  return (
    <div className={styles.page}>
      {/* Animated background grid */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Glitch number */}
      <div className={styles.glitchWrap} aria-hidden="true">
        <span className={styles.glitch} data-text="404">
          404
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.badge}>СТОРІНКУ НЕ ЗНАЙДЕНО</div>

        <h1 className={styles.title}>
          Щось пішло <span className={styles.accent}>не так</span>
        </h1>

        <p className={styles.desc}>
          Сторінка <code className={styles.path}>{location.pathname}</code> не існує або була
          переміщена.
        </p>

        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true })}
          >
            На головну
          </button>
          <button className={styles.btnSecondary} onClick={handleBack}>
            ← Назад
          </button>
        </div>

        <p className={styles.countdown}>
          Автоматичний редірект через <span className={styles.countdownNum}>{countdown}</span> сек
        </p>
      </div>
    </div>
  );
}
