// src/api/apiClient.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const TOKEN_KEY = 'auth-token';
export const USER_ID_KEY = 'userId';
export const USER_NAME_KEY = 'userName';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unknown error';

    if (error.response?.status === 401) {
      [TOKEN_KEY, USER_ID_KEY, USER_NAME_KEY].forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(new Event('auth:logout'));
    }

    error.userMessage = msg;
    return Promise.reject(error);
  },
);

export default apiClient;
