'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bracket_match', {
      bracket_match_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tournament_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tournament', key: 'tournament_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'match', key: 'match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      round: { type: Sequelize.INTEGER, allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false },
      next_bracket_match_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'bracket_match', key: 'bracket_match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('bracket_match');
  },
};
