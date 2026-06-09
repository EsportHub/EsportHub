'use strict';

module.exports = {
  up: async (queryInterface) => {
    // match — часто фільтруємо за статусом, tournament_id, start_time
    await queryInterface.addIndex('match', ['status'], {
      name: 'idx_match_status',
    });
    await queryInterface.addIndex('match', ['tournament_id'], {
      name: 'idx_match_tournament_id',
    });
    await queryInterface.addIndex('match', ['start_time'], {
      name: 'idx_match_start_time',
    });
    await queryInterface.addIndex('match', ['team1_id', 'team2_id'], {
      name: 'idx_match_teams',
    });

    // bracket_match — фільтр за tournament_id
    await queryInterface.addIndex('bracket_match', ['tournament_id'], {
      name: 'idx_bracket_match_tournament_id',
    });

    // player_transfer — фільтр за player_id
    await queryInterface.addIndex('player_transfer', ['player_id'], {
      name: 'idx_player_transfer_player_id',
    });

    // player — фільтр за country_id
    await queryInterface.addIndex('player', ['country_id'], {
      name: 'idx_player_country_id',
    });

    // favorite_team — фільтр за user_id та team_id
    await queryInterface.addIndex('favorite_team', ['user_id'], {
      name: 'idx_favorite_team_user_id',
    });
    await queryInterface.addIndex('favorite_team', ['team_id'], {
      name: 'idx_favorite_team_team_id',
    });

    // match_subscription — фільтр за user_id
    await queryInterface.addIndex('match_subscription', ['user_id'], {
      name: 'idx_match_subscription_user_id',
    });

    // player_match_stats — фільтр за player_id та match_id
    await queryInterface.addIndex('player_match_stats', ['player_id'], {
      name: 'idx_player_match_stats_player_id',
    });
    await queryInterface.addIndex('player_match_stats', ['match_id'], {
      name: 'idx_player_match_stats_match_id',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('match', 'idx_match_status');
    await queryInterface.removeIndex('match', 'idx_match_tournament_id');
    await queryInterface.removeIndex('match', 'idx_match_start_time');
    await queryInterface.removeIndex('match', 'idx_match_teams');
    await queryInterface.removeIndex('bracket_match', 'idx_bracket_match_tournament_id');
    await queryInterface.removeIndex('player_transfer', 'idx_player_transfer_player_id');
    await queryInterface.removeIndex('player', 'idx_player_country_id');
    await queryInterface.removeIndex('favorite_team', 'idx_favorite_team_user_id');
    await queryInterface.removeIndex('favorite_team', 'idx_favorite_team_team_id');
    await queryInterface.removeIndex('match_subscription', 'idx_match_subscription_user_id');
    await queryInterface.removeIndex('player_match_stats', 'idx_player_match_stats_player_id');
    await queryInterface.removeIndex('player_match_stats', 'idx_player_match_stats_match_id');
  },
};
