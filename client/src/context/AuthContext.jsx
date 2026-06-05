// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService } from '../api/services';
import { TOKEN_KEY, USER_ID_KEY, USER_NAME_KEY } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Зберігаємо дані сесії у localStorage
  const _persist = (tok, id, name) => {
    localStorage.setItem(TOKEN_KEY, tok);
    localStorage.setItem(USER_ID_KEY, String(id));
    localStorage.setItem(USER_NAME_KEY, name);
  };

  // Очищуємо сесію
  const _clear = () => {
    [TOKEN_KEY, USER_ID_KEY, USER_NAME_KEY].forEach((k) => localStorage.removeItem(k));
  };

  // Відновлення сесії при оновленні сторінки
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedId = localStorage.getItem(USER_ID_KEY);
    const storedName = localStorage.getItem(USER_NAME_KEY);

    if (storedToken && storedId && storedId !== 'undefined') {
      setToken(storedToken);
      // Тимчасово ставимо дані з localStorage поки завантажуємо профіль
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
          // Токен невалідний — виходимо
          _clear();
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Слухаємо подію виходу від apiClient (401)
    const onLogout = () => logout();
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []); // eslint-disable-line

  const login = useCallback(async (creds) => {
    const res = await authService.login(creds);
    const d = res.data;

    const tok = d.token || d.access_token || d.refresh_token || '';
    const id = String(d.user?.userId || d.user?.user_id || d.userId || d.user_id || d.id || '');
    const name = d.user?.username || d.username || creds.email.split('@')[0];

    if (!tok || !id || id === 'undefined') {
      console.error('Помилка: не вдалося отримати токен або ID', d);
      throw new Error('Невірна відповідь сервера');
    }

    _persist(tok, id, name);
    setToken(tok);
    setUser({
      user_id: id,
      id,
      userId: id,
      username: name,
      email: d.user?.email || creds.email,
    });

    return d;
  }, []);

  const register = useCallback(async (form) => {
    const res = await authService.register(form);
    const d = res.data?.data || res.data;

    const tok = d.token || d.access_token || d.refresh_token || '';
    const id = String(d.user?.userId || d.user?.user_id || d.userId || d.user_id || d.id || '');
    const name = d.user?.username || d.username || form.username || form.firstName;

    if (tok && id && id !== 'undefined') {
      _persist(tok, id, name);
      setToken(tok);
      setUser({
        user_id: id,
        id,
        userId: id,
        username: name,
        email: form.email,
      });
    }

    return d;
  }, []);

  const logout = useCallback(() => {
    _clear();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((p) => {
      if (!p) return null;
      const next = { ...p, ...patch };
      if (patch.username) localStorage.setItem(USER_NAME_KEY, patch.username);
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
