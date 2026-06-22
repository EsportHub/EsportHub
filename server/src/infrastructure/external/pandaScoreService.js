'use strict';

const axios = require('axios');

const BASE_URL = 'https://api.pandascore.co';
const API_KEY = process.env.PANDASCORE_API_KEY;
console.log('PANDA KEY:', API_KEY);

const pandaScoreService = {
  async getMatchesByDate(date, tier = null) {
    try {
      const params = {
        sort: 'begin_at',
        'page[size]': 50,
      };

      // ❗ PandaScore НЕ стабільно підтримує range[begin_at]
      // тому прибираємо його

      if (tier) {
        const tourResponse = await axios.get(`${BASE_URL}/tournaments`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
          params: {
            'filter[tier]': tier.toLowerCase(),
            'page[size]': 50,
          },
        });

        const ids = tourResponse.data.map((t) => t.id).join(',');

        console.log(`Знайдено турнірів tier=${tier}:`, tourResponse.data.length, 'ids:', ids);

        if (!ids) return [];

        params['filter[tournament_id]'] = ids;
      }

      const response = await axios.get(`${BASE_URL}/matches`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        params,
      });

      const data = response.data;

      // 🔥 ФІЛЬТР ПО ДАТІ (робимо вручну, бо API unreliable)
      const targetDate = date; // YYYY-MM-DD

      const filtered = data.filter((m) => m.begin_at?.startsWith(targetDate));

      return filtered;
    } catch (error) {
      console.error('PandaScore status:', error.response?.status);
      console.error('PandaScore body:', JSON.stringify(error.response?.data));
      throw error;
    }
  },

  async getTodayMatches() {
    return axios.get(`${BASE_URL}/matches`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      params: {
        'filter[status]': 'running',
        'page[size]': 50,
      },
    });
  },

  async getTournamentsWithLocation() {
    return [
      {
        tournament_id: 'ps_static_1',
        name: 'IEM Katowice 2025',
        start_date: '2025-02-05',
        end_date: '2025-02-23',
        prize_pool: 1000000,
        game: 'CS2',
        arena: 'Katowice',
        city: 'Katowice',
        latitude: 50.2649,
        longitude: 19.0238,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_2',
        name: 'ESL One Cologne 2025',
        start_date: '2025-07-17',
        end_date: '2025-07-20',
        prize_pool: 1000000,
        game: 'CS2',
        arena: 'Cologne',
        city: 'Cologne',
        latitude: 50.8334,
        longitude: 6.9794,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_3',
        name: 'PGL Major Copenhagen 2025',
        start_date: '2025-03-16',
        end_date: '2025-03-30',
        prize_pool: 1250000,
        game: 'CS2',
        arena: 'Copenhagen',
        city: 'Copenhagen',
        latitude: 55.6374,
        longitude: 12.5781,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_4',
        name: 'Esports World Cup 2025',
        start_date: '2025-07-06',
        end_date: '2025-08-24',
        prize_pool: 70000000,
        game: 'Dota 2',
        arena: 'Riyadh',
        city: 'Riyadh',
        latitude: 24.7136,
        longitude: 46.6753,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_5',
        name: 'BLAST Premier World Final 2025',
        start_date: '2025-12-10',
        end_date: '2025-12-14',
        prize_pool: 1000000,
        game: 'CS2',
        arena: 'Paris',
        city: 'Paris',
        latitude: 48.8384,
        longitude: 2.379,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_6',
        name: 'The International 2025',
        start_date: '2025-10-15',
        end_date: '2025-10-26',
        prize_pool: 40000000,
        game: 'Dota 2',
        arena: 'Vancouver',
        city: 'Vancouver',
        latitude: 49.2768,
        longitude: -123.1115,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_7',
        name: 'WePlay Esports Arena 2025',
        start_date: '2025-05-10',
        end_date: '2025-05-18',
        prize_pool: 500000,
        game: 'Dota 2',
        arena: 'Kyiv',
        city: 'Kyiv',
        latitude: 50.4501,
        longitude: 30.5234,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_8',
        name: 'DreamHack Open 2025',
        start_date: '2025-06-12',
        end_date: '2025-06-15',
        prize_pool: 100000,
        game: 'CS2',
        arena: 'Jönköping',
        city: 'Jönköping',
        latitude: 57.7826,
        longitude: 14.1618,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_9',
        name: 'ESL Pro League Season 2025',
        start_date: '2025-03-05',
        end_date: '2025-03-23',
        prize_pool: 850000,
        game: 'CS2',
        arena: 'Malta',
        city: 'Malta',
        latitude: 35.9375,
        longitude: 14.3754,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_10',
        name: 'BLAST Premier Spring Final 2025',
        start_date: '2025-06-04',
        end_date: '2025-06-08',
        prize_pool: 425000,
        game: 'CS2',
        arena: 'London',
        city: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_11',
        name: 'IEM Dallas 2025',
        start_date: '2025-05-26',
        end_date: '2025-06-01',
        prize_pool: 250000,
        game: 'CS2',
        arena: 'Amsterdam',
        city: 'Amsterdam',
        latitude: 52.3676,
        longitude: 4.9041,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_12',
        name: 'FACEIT Major 2025',
        start_date: '2025-09-14',
        end_date: '2025-09-28',
        prize_pool: 1250000,
        game: 'CS2',
        arena: 'Berlin',
        city: 'Berlin',
        latitude: 52.52,
        longitude: 13.405,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_13',
        name: 'ESL One Stockholm 2025',
        start_date: '2025-05-01',
        end_date: '2025-05-08',
        prize_pool: 400000,
        game: 'Dota 2',
        arena: 'Stockholm',
        city: 'Stockholm',
        latitude: 59.3293,
        longitude: 18.0686,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_14',
        name: 'BLAST Bounty 2025',
        start_date: '2025-04-10',
        end_date: '2025-04-13',
        prize_pool: 300000,
        game: 'CS2',
        arena: 'Madrid',
        city: 'Madrid',
        latitude: 40.4168,
        longitude: -3.7038,
        source: 'static',
      },
      {
        tournament_id: 'ps_static_15',
        name: 'PGL Bucharest 2025',
        start_date: '2025-08-10',
        end_date: '2025-08-17',
        prize_pool: 500000,
        game: 'CS2',
        arena: 'Bucharest',
        city: 'Bucharest',
        latitude: 44.4268,
        longitude: 26.1025,
        source: 'static',
      },
    ];
  },
};

module.exports = pandaScoreService;
