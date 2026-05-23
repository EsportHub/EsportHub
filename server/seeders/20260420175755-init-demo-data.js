'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    console.log('Inserting data...');

    // COUNTRY
    await queryInterface.bulkInsert('country', [
      { name: 'Ukraine', code: 'UA', flag: 'uk', description: 'Eastern Europe country' },
      { name: 'USA', code: 'US', flag: 'us', description: 'North America country' },
      { name: 'Denmark', code: 'DK', flag: 'dk', description: 'Scandinavian country' },
      { name: 'France', code: 'FR', flag: 'fr', description: 'Western Europe country' },
    ]);

    // CITY
    await queryInterface.bulkInsert('city', [
      { name: 'Kyiv', country_id: 1 },
      { name: 'New York', country_id: 2 },
      { name: 'Copenhagen', country_id: 3 },
      { name: 'Paris', country_id: 4 },
    ]);

    // GAME
    await queryInterface.bulkInsert('game', [
      { name: 'CS2', genre: 'FPS', developer: 'Valve' },
      { name: 'Dota 2', genre: 'MOBA', developer: 'Valve' },
    ]);

    await queryInterface.bulkInsert('map', [
      { name: 'Mirage', game_id: 1 },
      { name: 'Inferno', game_id: 1 },
      { name: 'Dust2', game_id: 1 },
      { name: 'Nuke', game_id: 1 },
      { name: 'Ancient', game_id: 1 },
      { name: 'Anubis', game_id: 1 },
      { name: 'Vertigo', game_id: 1 },
    ]);

    // ARENA
    await queryInterface.bulkInsert('arena', [
      { name: 'PGL Arena', city_id: 3, capacity: 5000, latitude: 55.6761, longitude: 12.5683 },
      { name: 'ESL Arena', city_id: 2, capacity: 3000, latitude: 40.7128, longitude: -74.006 },
    ]);

    // TEAM
    await queryInterface.bulkInsert('team', [
      {
        name: 'Natus Vincere',
        country_id: 1,
        city_id: 1,
        founded_date: '2009-12-17',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Natus_Vincere_Logo.png',
        description: 'Ukrainian esports organization',
      },
      {
        name: 'Team Liquid',
        country_id: 2,
        city_id: 2,
        founded_date: '2000-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Team_Liquid_logo.png',
        description: 'American esports organization',
      },
      {
        name: 'Astralis',
        country_id: 3,
        city_id: 3,
        founded_date: '2016-01-16',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Astralis_logo.png',
        description: 'Danish esports organization',
      },
      {
        name: 'Team Vitality',
        country_id: 4,
        city_id: 4,
        founded_date: '2013-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Team_Vitality_Logo.svg/1200px-Team_Vitality_Logo.svg.png',
        description: 'French esports organization',
      },
    ]);

    // TOURNAMENT
    await queryInterface.bulkInsert('tournament', [
      {
        name: 'PGL Major Copenhagen 2024',
        game_id: 1,
        arena_id: 1,
        start_date: '2024-03-17',
        end_date: '2024-03-31',
        prize_pool: 1250000.0,
      },
      {
        name: 'ESL One New York 2024',
        game_id: 2,
        arena_id: 2,
        start_date: '2024-09-01',
        end_date: '2024-09-08',
        prize_pool: 500000.0,
      },
    ]);

    // PLAYER
    await queryInterface.bulkInsert('player', [
      {
        nickname: 's1mple',
        real_name: 'Oleksandr Kostyliev',
        country_id: 1,
        birth_date: '1997-10-02',
        team_id: 1,
      },
      {
        nickname: 'electroNic',
        real_name: 'Denis Sharipov',
        country_id: 1,
        birth_date: '1998-07-15',
        team_id: 1,
      },
      {
        nickname: 'ZywOo',
        real_name: 'Mathieu Herbaut',
        country_id: 4,
        birth_date: '2000-11-09',
        team_id: 4,
      },
      {
        nickname: 'device',
        real_name: 'Nicolai Reedtz',
        country_id: 3,
        birth_date: '1996-09-08',
        team_id: 3,
      },
      {
        nickname: 'nitr0',
        real_name: 'Nick Cannella',
        country_id: 2,
        birth_date: '1995-08-14',
        team_id: 2,
      },
    ]);

    // MATCH
    await queryInterface.bulkInsert('match', [
      {
        team1_id: 1,
        team2_id: 3,
        tournament_id: 1,
        score_team1: 2,
        score_team2: 0,
        status: 'finished',
        start_time: '2024-03-20 14:00:00',
      },
      {
        team1_id: 2,
        team2_id: 4,
        tournament_id: 1,
        score_team1: 1,
        score_team2: 2,
        status: 'finished',
        start_time: '2024-03-21 16:00:00',
      },
      {
        team1_id: 1,
        team2_id: 2,
        tournament_id: 1,
        score_team1: 0,
        score_team2: 0,
        status: 'upcoming',
        start_time: '2026-06-01 15:00:00',
      },
    ]);

    // MATCH MAP PHASE (pick/ban)
    await queryInterface.bulkInsert('match_map_phase', [
      { match_id: 1, team_id: 1, map_id: 3, action_type: 'ban', order_number: 1 },
      { match_id: 1, team_id: 3, map_id: 5, action_type: 'ban', order_number: 2 },
      { match_id: 1, team_id: 1, map_id: 1, action_type: 'pick', order_number: 3 },
      { match_id: 1, team_id: 3, map_id: 2, action_type: 'pick', order_number: 4 },
      { match_id: 1, team_id: 1, map_id: 6, action_type: 'ban', order_number: 5 },
      { match_id: 1, team_id: 3, map_id: 7, action_type: 'ban', order_number: 6 },
      { match_id: 1, team_id: null, map_id: 4, action_type: 'left', order_number: 7 },
    ]);

    // PLAYER MATCH STATS
    await queryInterface.bulkInsert('player_match_stats', [
      { player_id: 1, match_id: 1, kills: 28, deaths: 12, assists: 5 },
      { player_id: 2, match_id: 1, kills: 20, deaths: 15, assists: 8 },
      { player_id: 4, match_id: 1, kills: 14, deaths: 22, assists: 3 },
      { player_id: 5, match_id: 2, kills: 18, deaths: 19, assists: 7 },
      { player_id: 3, match_id: 2, kills: 25, deaths: 10, assists: 6 },
    ]);

    // USERS
    const passwordHash = await bcrypt.hash('123456', 10);
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@test.com',
        password_hash: passwordHash,
        theme_preference: 'dark',
      },
      {
        username: 'user1',
        email: 'user1@test.com',
        password_hash: passwordHash,
        theme_preference: 'light',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('player_match_stats', null, {});
    await queryInterface.bulkDelete('match', null, {});
    await queryInterface.bulkDelete('player', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('tournament', null, {});
    await queryInterface.bulkDelete('team', null, {});
    await queryInterface.bulkDelete('arena', null, {});
    await queryInterface.bulkDelete('game', null, {});
    await queryInterface.bulkDelete('city', null, {});
    await queryInterface.bulkDelete('country', null, {});
    await queryInterface.bulkDelete('match_map_phase', null, {});
    await queryInterface.bulkDelete('map', null, {});
  },
};
