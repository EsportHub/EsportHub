// src/hooks/useNotifications.js
import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

export function useMatchNotifications(matches = []) {
  const { addToast } = useToast();
  const timersRef = useRef({});

  // Допоміжна функція для отримання назви команди (текст або об'єкт)
  const getTeamName = (team) => {
    if (!team) return 'TBD';
    return typeof team === 'object' ? team.name : String(team);
  };

  useEffect(() => {
    // Очищуємо попередні таймери перед створенням нових
    Object.values(timersRef.current).forEach(clearTimeout);
    timersRef.current = {};

    if (!matches || matches.length === 0) return;

    matches.forEach((match) => {
      const matchId = match.match_id || match.id;
      const key = `notify_match_${matchId}`;

      // Перевіряємо локальне сховище
      if (!localStorage.getItem(key)) return;

      const startTime = new Date(match.start_time).getTime();
      const notifyAt = startTime - 10 * 60 * 1000; // за 10 хвилин
      const delay = notifyAt - Date.now();

      // Якщо час нагадування ще не минув і матч не занадто далеко (в межах 24г)
      if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
        timersRef.current[key] = setTimeout(() => {
          const t1 = getTeamName(match.team1);
          const t2 = getTeamName(match.team2);

          addToast(
            `Матч ${t1} vs ${t2} почнеться за 10 хвилин!`,
            'info',
            10000, // тримаємо повідомлення 10 секунд
          );

          // Видаляємо з localStorage після спрацювання
          localStorage.removeItem(key);
        }, delay);
      } else if (delay <= 0 && startTime > Date.now()) {
        // Якщо до матчу менше 10 хв, але він ще не почався — можна теж попередити
        // або просто видалити, щоб не спамити. Залишаємо видалення.
      }
    });

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, [matches]); // eslint-disable-line

  const subscribeToMatch = (match) => {
    const id = match.match_id || match.id;
    localStorage.setItem(`notify_match_${id}`, '1');
  };

  const unsubscribeFromMatch = (match) => {
    const id = match.match_id || match.id;
    localStorage.removeItem(`notify_match_${id}`);
    if (timersRef.current[`notify_match_${id}`]) {
      clearTimeout(timersRef.current[`notify_match_${id}`]);
      delete timersRef.current[`notify_match_${id}`];
    }
  };

  const isSubscribed = (match) => {
    const id = match.match_id || match.id;
    return !!localStorage.getItem(`notify_match_${id}`);
  };

  return { subscribeToMatch, unsubscribeFromMatch, isSubscribed };
}
