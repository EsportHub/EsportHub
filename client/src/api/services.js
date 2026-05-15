// src/api/services.js
import apiClient from './apiClient';

export const authService = {
  login: (creds) => apiClient.post('/auth/login', creds),
  register: (data) => apiClient.post('/auth/register', data),
};

export const userService = {
  getProfile: (id) => apiClient.get(`/users/profile/${id}`),
  updateProfile: (id, data) => apiClient.patch(`/users/profile/${id}`, data),
};

export const teamService = {
  getAll: () => apiClient.get('/teams'),
  getById: (id) => apiClient.get(`/teams/${id}`),
};

export const matchService = {
  getAll: () => apiClient.get('/matches'),
  getById: (id) => apiClient.get(`/matches/${id}`),

  getSubscriptions: (userId) => apiClient.get(`matches/subscriptions/${userId}`),

  // 🔥 Повертаємо user_id та match_id (як очікує бекенд)
  subscribe: (userId, matchId) =>
    apiClient.post('matches/subscriptions', {
      user_id: userId,
      match_id: matchId,
    }),

  // 🔥 Повертаємо user_id та match_id
  unsubscribe: (userId, matchId) =>
    apiClient.delete('matches/subscriptions', {
      data: {
        user_id: userId,
        match_id: matchId,
      },
    }),
};

export const tournamentService = {
  getAll: () => apiClient.get('/tournaments'),
  getForMap: () => apiClient.get('/tournaments/map'),
  getById: (id) => apiClient.get(`/tournaments/${id}`),
};

export const countryService = {
  getAll: () => apiClient.get('/countries'),
  getById: (id) => apiClient.get(`/countries/${id}`),
  getTeamsByCountry: (id) => apiClient.get(`/countries/${id}/teams`),
};

export const playerService = {
  getAll: () => apiClient.get('/players'),
  getById: (id) => apiClient.get(`/players/${id}`),
};

export const favoriteService = {
  // 🔥 Повертаємо user_id та team_id
  addTeam: (userId, teamId) =>
    apiClient.post('/users/favorites/teams', {
      user_id: userId,
      team_id: teamId,
    }),

  removeTeam: (userId, teamId) =>
    apiClient.delete('/users/favorites/teams', {
      data: {
        user_id: userId,
        team_id: teamId,
      },
    }),

  getTeams: (userId) => apiClient.get(`/users/${userId}/favorites/teams`),
};
