// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService } from '../api/services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функція для збереження даних у браузері
  const _persist = (tok, id, name) => {
    localStorage.setItem('refresh-token', tok);
    localStorage.setItem('userId', String(id));
    localStorage.setItem('userName', name);
  };

  useEffect(() => {
    // Відновлення сесії при оновленні сторінки
    const storedToken = localStorage.getItem('refresh-token');
    const storedId = localStorage.getItem('userId');
    const storedName = localStorage.getItem('userName');

    if (storedToken && storedId && storedId !== 'undefined') {
      setToken(storedToken);
      // Тимчасово ставимо дані з localStorage
      setUser({
        user_id: storedId,
        id: storedId,
        userId: storedId,
        username: storedName || 'Користувач',
      });

      // Отримуємо свіжі дані профілю з сервера
      userService
        .getProfile(storedId)
        .then((res) => {
          const d = res.data?.data || res.data;
          setUser({
            user_id: String(d.userId || d.user_id || storedId),
            id: String(d.userId || d.user_id || storedId),
            userId: String(d.userId || d.user_id || storedId),
            username: d.username || d.name || storedName,
            email: d.email,
            theme: d.theme_preference,
          });
        })
        .catch(() => {
          // Якщо токен невалідний — виходимо
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    const onLogout = () => logout();
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  const login = useCallback(async (creds) => {
    const res = await authService.login(creds);
    const d = res.data; // Згідно з твоїм JSON, дані на верхньому рівні res.data

    // 1. Дістаємо токен
    const tok = d.token || d.refresh_token || d.access_token || '';

    // 2. Дістаємо ID (у тебе це d.user.userId)
    const id = String(d.user?.userId || d.userId || d.user_id || d.id || '');
    const name = d.user?.username || d.username || creds.email.split('@')[0];

    if (tok && id && id !== 'undefined') {
      _persist(tok, id, name);
      setToken(tok);
      setUser({
        user_id: id,
        id: id,
        userId: id,
        username: name,
        email: d.user?.email || creds.email,
      });
    } else {
      console.error('Помилка: Не вдалося отримати токен або ID користувача', d);
    }
    return d;
  }, []);

  const register = useCallback(async (form) => {
    const res = await authService.register(form);
    const d = res.data?.data || res.data;

    const tok = d.token || d.refresh_token || d.access_token || '';
    const id = String(d.user?.userId || d.userId || d.user_id || d.id || '');
    const name = d.user?.username || d.username || form.username || form.firstName;

    if (tok && id && id !== 'undefined') {
      _persist(tok, id, name);
      setToken(tok);
      setUser({
        user_id: id,
        id: id,
        userId: id,
        username: name,
        email: form.email,
      });
    }
    return d;
  }, []);

  const logout = useCallback(() => {
    ['refresh-token', 'userId', 'userName'].forEach((k) => localStorage.removeItem(k));
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((p) => {
      if (!p) return null;
      const next = { ...p, ...patch };
      if (patch.username) localStorage.setItem('userName', patch.username);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user?.id,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
