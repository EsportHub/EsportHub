import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './MatchLiveCenter.module.css';

import Header from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

const initialPickBans = [
  { team: 'navi', type: 'BAN', map: 'Vertigo', color: '#6b1111' },
  { team: 'navi', type: 'Pick', map: 'Ancient', color: '#3a0066' },
  { team: 'navi', type: 'BAN', map: 'Overpass', color: '#6b1111' },
  { team: 'neutral', type: 'Wait...', map: '', color: '#222' },
  { team: 'neutral', type: 'Wait...', map: '', color: '#222' },
  { team: 'faze', type: 'Wait...', map: '', color: '#222' },
  { team: 'faze', type: 'Wait...', map: '', color: '#222' },
  { team: 'faze', type: 'Pick', map: 'Mirage', color: '#3a0066' },
  { team: 'faze', type: 'BAN', map: 'Anubis', color: '#6b1111' },
  { team: 'faze', type: 'Pick', map: 'Inferno', color: '#3a0066' },
];

const initialNaviStats = [
  { id: 2, name: 's1mple', rud: '1/2', k: 24, d: 12, a: 5, rating: 1.45 },
  { id: 3, name: 'b1t', rud: '1/2', k: 18, d: 14, a: 3, rating: 1.15 },
  { id: 4, name: 'Aleksib', rud: '1/2', k: 12, d: 16, a: 8, rating: 0.94 },
  { id: 1, name: 'jL', rud: '1/2', k: 15, d: 13, a: 4, rating: 0.89 },
  { id: 5, name: 'iM', rud: '1/2', k: 14, d: 15, a: 6, rating: 0.85 },
];

const initialFazeStats = [
  { id: 6, name: 'karrigan', rud: '1/2', k: 10, d: 18, a: 7, rating: 0.65 },
  { id: 7, name: 'ropz', rud: '1/2', k: 22, d: 11, a: 4, rating: 1.35 },
  { id: 8, name: 'broky', rud: '1/2', k: 20, d: 13, a: 5, rating: 1.15 },
  { id: 9, name: 'Twistzz', rud: '1/2', k: 17, d: 14, a: 6, rating: 1.05 },
  { id: 10, name: 'rain', rud: '1/2', k: 16, d: 15, a: 4, rating: 0.95 },
];

export default function MatchLiveCenter() {
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);

  const [score, setScore] = useState({ t1: 12, t2: 10, map: 'Nuke' });
  const [naviStats, setNaviStats] = useState(initialNaviStats);
  const [fazeStats, setFazeStats] = useState(initialFazeStats);

  useEffect(() => {
    const interval = setInterval(() => {
      setNaviStats((prev) => prev.map((p) => (p.id === 2 ? { ...p, k: p.k + 1 } : p)));
      if (Math.random() > 0.8) {
        setScore((s) => ({ ...s, t1: s.t1 + 1 }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const StatsTable = ({ teamName, players }) => (
    <div className={styles.statsTableContainer}>
      <div className={styles.teamBadge}>
        <div
          className={styles.teamColor}
          style={{ background: teamName === 'NAVI' ? '#ffdf00' : '#ff0000' }}
        ></div>
        <h3>{teamName}</h3>
      </div>
      <table className={styles.statsTable}>
        <thead>
          <tr>
            <th>Гравець</th>
            <th>ID</th>
            <th>RUD</th>
            <th>K/D/A</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id}>
              <td className={styles.playerCell}>
                <div className={styles.avatarPlaceholder}></div>
                {p.name}
              </td>
              <td>{p.id}</td>
              <td>{p.rud}</td>
              <td style={{ fontWeight: 'bold' }}>
                {p.k}/{p.d}/{p.a}
              </td>
              <td>
                <span
                  className={styles.ratingBadge}
                  style={{ background: p.rating > 1 ? '#a800ff' : '#333' }}
                >
                  {p.rating.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      {}
      <Header />

      <main className={styles.content}>
        {}
        <div className={styles.scoreboardTop}>
          <div className={styles.teamLogo}>NAVI</div>

          <div className={styles.scoreCenter}>
            <div className={styles.tournamentInfo}>
              <span className={styles.liveBadge}>Live</span>
              <span>⚔ PGL Major Copenhagen 2024 • Гранд Фінал</span>
            </div>

            <div className={styles.scoreNumbers}>
              {score.t1} : {score.t2}
            </div>
            <div className={styles.currentMap}>мапа : {score.map}</div>
          </div>

          <div className={styles.teamLogo}>FaZe</div>
        </div>

        {}
        <div className={styles.matchHeader}>
          <div className={styles.actions}>
            <button className={styles.shareBtn} onClick={handleShare}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              <span>Поділитися</span>
            </button>
          </div>
        </div>

        {}
        <div className={styles.streamArea}>
          <div className={styles.playerPlaceholder}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#a800ff">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <p>STREAM PLACEHOLDER</p>
          </div>
        </div>

        {}
        <div className={styles.pickBanSection}>
          <h3 className={styles.sectionTitle}>Фаза Pick/Ban</h3>
          <div className={styles.pickBanRow}>
            {initialPickBans.map((pb, idx) => (
              <div
                key={idx}
                className={styles.pbCard}
                style={{
                  background: pb.color,
                  borderStyle: pb.type.includes('Wait') ? 'dashed' : 'solid',
                }}
              >
                <div className={styles.pbType}>{pb.type}</div>
                <div className={styles.pbMap}>{pb.map}</div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Live статистика гравців</h2>

          <div className={styles.statsGrid}>
            <div className={styles.statsColumn}>
              <StatsTable teamName="NAVI" players={naviStats} />
              <StatsTable teamName="FaZe" players={fazeStats} />
            </div>

            {}
            <div className={styles.infoColumn}>
              <h3 className={styles.sectionTitle}>Хронологія матчу</h3>
              <div className={styles.timelinePlaceholder}>
                <p style={{ color: '#fff', fontSize: '0.9rem' }}>
                  <strong>12:45</strong> - NAVI виграли раунд (Еко)
                </p>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  <strong>12:42</strong> - NAVI виграли раунд
                </p>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                  <strong>12:38</strong> - FaZe виграли раунд (Клатч 1v3 від ropz)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {}
      <Footer />

      {}
      {showToast && (
        <div className={`${styles.toast} ${styles.toastSuccess}`}>
          <div className={styles.toastIcon}>✓</div>
          <span>Посилання скопійовано!</span>
        </div>
      )}
    </div>
  );
}
