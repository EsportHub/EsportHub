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

// Protected route wrapper
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
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
