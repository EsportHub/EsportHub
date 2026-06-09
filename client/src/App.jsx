// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Pages
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Teams/Teams';
import Profile from './pages/Profile/Profile';
import MatchLiveCenter from './pages/MatchLiveCenter/MatchLiveCenter';
import Players from './pages/Players/Players';
import Matches from './pages/Matches/Matches';
import TournamentBracket from './pages/Tournament/TournamentBracket';
import NotFound from './pages/NotFound/NotFound';

// ── Guards ────────────────────────────────────────────────────────────────────

/**
 * Захищений маршрут — тільки для авторизованих.
 * Якщо не авторизований → редірект на /login, зберігаючи поточний шлях у state
 * щоб після входу можна було повернутись.
 */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // Чекаємо відновлення сесії

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Публічний маршрут — тільки для НЕ авторизованих (login / register).
 * Якщо вже авторизований → редірект на /dashboard (або попередню сторінку).
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ── Routes ────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Кореневий редірект */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Публічні маршрути (тільки для незалогінених) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      {/* Захищені маршрути */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/match/:id"
        element={
          <PrivateRoute>
            <MatchLiveCenter />
          </PrivateRoute>
        }
      />
      <Route
        path="/players"
        element={
          <PrivateRoute>
            <Players />
          </PrivateRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <PrivateRoute>
            <Matches />
          </PrivateRoute>
        }
      />
      <Route
        path="/tournament/:id/bracket"
        element={
          <PrivateRoute>
            <TournamentBracket />
          </PrivateRoute>
        }
      />

      {/* 404 — будь-який невідомий шлях */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
