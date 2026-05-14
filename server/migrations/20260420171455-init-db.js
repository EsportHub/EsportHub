'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('country', {
      country_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      code: { type: Sequelize.STRING(10), allowNull: false, unique: true },
      flag: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
    });

    await queryInterface.createTable('city', {
      city_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'country', key: 'country_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('game', {
      game_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      genre: { type: Sequelize.STRING(100), allowNull: true },
      developer: { type: Sequelize.STRING(100), allowNull: true },
    });

    // ✅ USERS (виправлено)
    await queryInterface.createTable('users', {
      user_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      theme_preference: { type: Sequelize.STRING(10), allowNull: true },
    });

    await queryInterface.createTable('article', {
      article_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      create_time: { type: Sequelize.DATE, allowNull: false },
      update_time: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable('map_marker', {
      marker_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.STRING(50), allowNull: false },
      entity_id: { type: Sequelize.INTEGER, allowNull: false },
      latitude: { type: Sequelize.DECIMAL(9, 6), allowNull: false },
      longitude: { type: Sequelize.DECIMAL(9, 6), allowNull: false },
    });

    await queryInterface.createTable('team', {
      team_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'country', key: 'country_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'city', key: 'city_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      founded_date: { type: Sequelize.DATEONLY, allowNull: true },
      logo: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
    });

    await queryInterface.createTable('arena', {
      arena_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'city', key: 'city_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      capacity: { type: Sequelize.INTEGER, allowNull: true },
      latitude: { type: Sequelize.DECIMAL(9, 6), allowNull: true },
      longitude: { type: Sequelize.DECIMAL(9, 6), allowNull: true },
    });

    await queryInterface.createTable('player', {
      player_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      nickname: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      real_name: { type: Sequelize.STRING(100), allowNull: true },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'country', key: 'country_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      birth_date: { type: Sequelize.DATEONLY, allowNull: true },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });

    await queryInterface.createTable('map', {
      map_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game', key: 'game_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('tournament', {
      tournament_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'game', key: 'game_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      arena_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'arena', key: 'arena_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY, allowNull: false },
      prize_pool: { type: Sequelize.DECIMAL(12, 2), allowNull: true },
    });

    await queryInterface.createTable('team_game', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'game', key: 'game_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.createTable('tournament_team', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tournament_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tournament', key: 'tournament_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      place: { type: Sequelize.INTEGER, allowNull: true },
    });

    await queryInterface.createTable('match', {
      match_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      team1_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      team2_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tournament_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tournament', key: 'tournament_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score_team1: { type: Sequelize.INTEGER, defaultValue: 0 },
      score_team2: { type: Sequelize.INTEGER, defaultValue: 0 },
      status: { type: Sequelize.STRING(50), allowNull: false },
      start_time: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('match_event', {
      event_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'match', key: 'match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      event_type: { type: Sequelize.STRING(50), allowNull: false },
      event_time: { type: Sequelize.DATE, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
    });

    await queryInterface.createTable('match_map_phase', {
      phase_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'match', key: 'match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      map_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'map', key: 'map_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action_type: { type: Sequelize.STRING(20), allowNull: false },
      order_number: { type: Sequelize.INTEGER, allowNull: false },
    });

    await queryInterface.createTable('player_match_stats', {
      stats_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'player', key: 'player_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'match', key: 'match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      kills: { type: Sequelize.INTEGER, defaultValue: 0 },
      deaths: { type: Sequelize.INTEGER, defaultValue: 0 },
      assists: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    // ✅ ВИПРАВЛЕНО ТУТ
    await queryInterface.createTable('favorite_team', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'team', key: 'team_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      create_time: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable('match_subscription', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'match', key: 'match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      create_time: { type: Sequelize.DATE, allowNull: false },
    });
    // ✅ ВИПРАВЛЕНО ТУТ
    await queryInterface.createTable('notification', {
      notification_id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      match_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'match', key: 'match_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      message: { type: Sequelize.TEXT, allowNull: false },
      send_time: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.STRING(50), allowNull: false },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('match_subscription');
    await queryInterface.dropTable('notification');
    await queryInterface.dropTable('favorite_team');
    await queryInterface.dropTable('player_match_stats');
    await queryInterface.dropTable('match_map_phase');
    await queryInterface.dropTable('match_event');
    await queryInterface.dropTable('match');
    await queryInterface.dropTable('tournament_team');
    await queryInterface.dropTable('team_game');
    await queryInterface.dropTable('tournament');
    await queryInterface.dropTable('map');
    await queryInterface.dropTable('player');
    await queryInterface.dropTable('arena');
    await queryInterface.dropTable('team');
    await queryInterface.dropTable('map_marker');
    await queryInterface.dropTable('article');
    await queryInterface.dropTable('users'); // ✅ FIX
    await queryInterface.dropTable('game');
    await queryInterface.dropTable('city');
    await queryInterface.dropTable('country');
  },
};
