// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      // Підтримка різних форматів відповіді бекенду
      const d = res.data?.data ?? res.data;
      setData(d);
      return d;
    } catch (e) {
      setError(e.userMessage || 'Помилка завантаження');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  return { data, loading, error, refetch: execute };
}

export function usePolling(apiFn, intervalMs = 15000, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const res = await apiFn();
      const d = res.data?.data ?? res.data;
      setData(d);
      setError(null);
    } catch (e) {
      setError(e.userMessage || 'Помилка оновлення даних');
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    fetch(); // Перший виклик відразу
    const timer = setInterval(fetch, intervalMs);
    return () => clearInterval(timer);
  }, [fetch, intervalMs]);

  return { data, loading, error, refetch: fetch };
}
