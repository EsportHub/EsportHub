'use strict';

const axios = require('axios');

const BASE_URL = 'https://api.pandascore.co';
const API_KEY = process.env.PANDASCORE_API_KEY;

const pandaScoreService = {
  async getMatchesByDate(date, tier = null) {
    try {
      const params = {
        'range[begin_at]': `${date}T00:00:00Z,${date}T23:59:59Z`,
        sort: 'begin_at',
        'page[size]': 50,
      };

      if (tier) {
        // Крок 1: отримати турніри за tier
        const tourResponse = await axios.get(`${BASE_URL}/tournaments`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
          params: {
            'filter[tier]': tier.toLowerCase(),
            'range[begin_at]': `${date}T00:00:00Z,${date}T23:59:59Z`,
            'page[size]': 50,
          },
        });

        const ids = tourResponse.data.map((t) => t.id).join(',');
        console.log(`Знайдено турнірів tier=${tier}:`, tourResponse.data.length, 'ids:', ids);

        if (!ids) return []; // немає турнірів — повертаємо порожній масив

        // Крок 2: матчі лише цих турнірів
        params['filter[tournament_id]'] = ids;
      }

      const response = await axios.get(`${BASE_URL}/matches`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        params,
      });

      return response.data;
    } catch (error) {
      console.error('PandaScore status:', error.response?.status);
      console.error('PandaScore body:', JSON.stringify(error.response?.data));
      throw error;
    }
  },

  async getTodayMatches(tier = null) {
    const today = new Date().toISOString().split('T')[0];
    return pandaScoreService.getMatchesByDate(today, tier);
  },
};

module.exports = pandaScoreService;
