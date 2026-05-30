'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('player_transfer', {
      transfer_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'player', key: 'player_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      from_team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      to_team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      transfer_date: { type: Sequelize.DATEONLY, allowNull: false },
      transfer_fee: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
      status: {
        type: Sequelize.ENUM('confirmed', 'pending', 'cancelled'),
        allowNull: false,
        defaultValue: 'confirmed',
      },
      notes: { type: Sequelize.TEXT, allowNull: true },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('player_transfer');
  },
};
