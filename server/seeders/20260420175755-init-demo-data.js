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
    ]);

    // CITY
    await queryInterface.bulkInsert('city', [
      { name: 'Kyiv', country_id: 1 },
      { name: 'New York', country_id: 2 },
      { name: 'Copenhagen', country_id: 3 },
    ]);

    // GAME
    await queryInterface.bulkInsert('game', [
      { name: 'CS2', genre: 'FPS', developer: 'Valve' },
      { name: 'Dota 2', genre: 'MOBA', developer: 'Valve' },
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

    // USERS (ВАЖЛИВО: без createdAt/updatedAt)
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
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('tournament', null, {});
    await queryInterface.bulkDelete('team', null, {});
    await queryInterface.bulkDelete('arena', null, {});
    await queryInterface.bulkDelete('game', null, {});
    await queryInterface.bulkDelete('city', null, {});
    await queryInterface.bulkDelete('country', null, {});
  },
};
