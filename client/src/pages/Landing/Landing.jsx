import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Zap, ChevronRight } from 'lucide-react';
import styles from './Landing.module.css';
import liveMatchImg from '../..//img/feature-live-match.jpg';
import worldMapImg from '../..//img/feature-world-map.jpg';
import analyticsImg from '../..//img/feature-analytics.jpg';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={styles.landing}>
      {/* Header */}
      <header className={styles.header}>
        <div onClick={() => navigate('/')} className={styles.logo} style={{ cursor: 'pointer' }}>
          EsportHub
        </div>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li>
              <button onClick={() => navigate('/')} className={styles.navLink}>
                Головна
              </button>
            </li>
            <li>
              <button className={styles.navLink}>Турніри</button>
            </li>
            <li>
              <button className={styles.navLink}>Команди</button>
            </li>
            <li>
              <button className={styles.navLink}>Гравці</button>
            </li>
          </ul>
        </nav>

        <div className={styles.headerButtons}>
          <button className={styles.btnOutline} onClick={() => navigate('/login')}>
            Увійти
          </button>
          <button className={styles.btnPrimary} onClick={() => navigate('/register')}>
            Зареєструватися
          </button>
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Zap size={16} />
            <span>Аналітика гравців у реальному часі доступна!</span>
          </div>
          <h1 className={styles.heroTitle}>Слідкуй за матчем у реальному часі</h1>
          <p className={styles.heroDescription}>
            Дивись статистику, відстежуй улюблені команди та аналізуй гру на найвищому рівні.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.btnPrimary}>Почати</button>
            <button className={styles.btnOutline}>Переглянути матчі</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>
            Більше ніж просто <span>результат</span>
          </h2>
          <div className={styles.featuresList}>
            <article className={styles.featureItem}>
              <div className={styles.featureContent}>
                <h3 className={styles.featureLabel}>Live матчі</h3>
                <p className={styles.featureDescription}>
                  Отримуйте оновлення рахунку за лічені мілісекунди.
                </p>
                <button className={styles.featureBtn}>
                  Переглянути <ChevronRight size={16} />
                </button>
              </div>
              <div className={styles.featureImage}>
                <div className={styles.featureImageWrapper}>
                  <img src={liveMatchImg} alt="Live матч" />
                </div>
              </div>
            </article>

            <article className={styles.featureItem}>
              <div className={styles.featureContent}>
                <h3 className={styles.featureLabel}>Світова мапа</h3>
                <p className={styles.featureDescription}>
                  Інтерактивна мапа подій допоможе відстежувати турніри.
                </p>
                <button className={styles.featureBtn}>
                  Переглянути <ChevronRight size={16} />
                </button>
              </div>
              <div className={styles.featureImage}>
                <div className={styles.featureImageWrapper}>
                  <img src={worldMapImg} alt="Світова мапа" />
                </div>
              </div>
            </article>

            <article className={styles.featureItem}>
              <div className={styles.featureContent}>
                <h3 className={styles.featureLabel}>Аналітика</h3>
                <p className={styles.featureDescription}>
                  Детальна статистика кожного гравця та теплові карти.
                </p>
                <button className={styles.featureBtn}>
                  Переглянути <ChevronRight size={16} />
                </button>
              </div>
              <div className={styles.featureImage}>
                <div className={styles.featureImageWrapper}>
                  <img src={analyticsImg} alt="Аналітика" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>EsportHub</div>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}></a>
                <a href="#" className={styles.socialLink}></a>
                <a href="#" className={styles.socialLink}></a>
              </div>
            </div>
            <div className={styles.footerColumn}>
              <h4>About</h4>
              <ul>
                <li>
                  <a href="#">How it works</a>
                </li>
                <li>
                  <a href="#">Partnership</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Socials</h4>
              <ul>
                <li>
                  <a href="#">Discord</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>&copy; 2026 EsportHub</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
