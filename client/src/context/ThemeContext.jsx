// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../api/services';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated && user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [isAuthenticated, user?.theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);

    const userId = user?.user_id || user?.id;
    if (isAuthenticated && userId) {
      try {
        await userService.updateProfile(userId, { theme_preference: next });
      } catch {
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
