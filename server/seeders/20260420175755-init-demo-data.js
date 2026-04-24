'use strict';

const bcrypt = require('bcryptjs');

console.log('Inserting data...');

module.exports = {
  async up(queryInterface) {
    const [countries] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM country',
    );
    if (countries[0].count === '0') {
      await queryInterface.bulkInsert('country', [
        { name: 'Ukraine', code: 'UA', flag: 'uk', description: 'Test country' },
        { name: 'USA', code: 'US', flag: 'usa', description: 'Test country' },
      ]);
    }

    const [games] = await queryInterface.sequelize.query('SELECT COUNT(*) as count FROM game');
    if (games[0].count === '0') {
      await queryInterface.bulkInsert('game', [
        { name: 'CS2', genre: 'FPS', developer: 'Valve' },
        { name: 'Dota 2', genre: 'MOBA', developer: 'Valve' },
      ]);
    }

    const [users] = await queryInterface.sequelize.query('SELECT COUNT(*) as count FROM users');
    if (users[0].count === '0') {
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
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('game', null, {});
    await queryInterface.bulkDelete('country', null, {});
  },
};
