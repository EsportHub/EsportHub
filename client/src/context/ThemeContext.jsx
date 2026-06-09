// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../api/services';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Початкова тема з localStorage або за замовчуванням dark
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const { user, isAuthenticated } = useAuth();

  // Ефект для застосування теми до документа
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Також додаємо клас до body для зручності стилізації в CSS
    document.body.className = theme + '-theme';
  }, [theme]);

  // Синхронізація теми з профілем користувача при логіні
  useEffect(() => {
    if (isAuthenticated && user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [isAuthenticated, user?.theme]);

  const toggleTheme = async () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);

    // Використовуємо user_id або id для запиту
    const userId = user?.user_id || user?.id;

    if (isAuthenticated && userId) {
      try {
        await userService.updateProfile(userId, { theme_preference: next });
      } catch (error) {
        console.error('Не вдалося зберегти налаштування теми на сервері', error);
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
