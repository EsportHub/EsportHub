import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

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
import PlayerPage from './pages/Players/PlayerPage';
import TeamPage from './pages/Teams/TeamPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import Landing from './pages/Landing/Landing';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/landing" element={<Landing />} />

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

      {}
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
        path="/teams/:id"
        element={
          <PrivateRoute>
            <TeamPage />
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
        path="/players/:id"
        element={
          <PrivateRoute>
            <PlayerPage />
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

      {}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

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
