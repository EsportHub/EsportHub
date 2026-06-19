'use strict';

module.exports = {
  up: async (queryInterface) => {
    const addIndex = async (table, columns, name) => {
      try {
        await queryInterface.addIndex(table, columns, { name });
      } catch (e) {
        if (!e.message.includes('Duplicate key')) throw e;
      }
    };

    await addIndex('match', ['status'], 'idx_match_status');
    await addIndex('match', ['tournament_id'], 'idx_match_tournament_id');
    await addIndex('match', ['start_time'], 'idx_match_start_time');
    await addIndex('match', ['team1_id', 'team2_id'], 'idx_match_teams');
    await addIndex('bracket_match', ['tournament_id'], 'idx_bracket_match_tournament_id');
    await addIndex('player_transfer', ['player_id'], 'idx_player_transfer_player_id');
    await addIndex('player', ['country_id'], 'idx_player_country_id');
    await addIndex('favorite_team', ['user_id'], 'idx_favorite_team_user_id');
    await addIndex('favorite_team', ['team_id'], 'idx_favorite_team_team_id');
    await addIndex('player_match_stats', ['player_id'], 'idx_player_match_stats_player_id');
    await addIndex('player_match_stats', ['match_id'], 'idx_player_match_stats_match_id');
  },

  down: async (queryInterface) => {
    const removeIndex = async (table, name) => {
      try {
        await queryInterface.removeIndex(table, name);
      } catch (e) {
        if (!e.message.includes("Can't DROP")) throw e;
      }
    };

    await removeIndex('match', 'idx_match_status');
    await removeIndex('match', 'idx_match_tournament_id');
    await removeIndex('match', 'idx_match_start_time');
    await removeIndex('match', 'idx_match_teams');
    await removeIndex('bracket_match', 'idx_bracket_match_tournament_id');
    await removeIndex('player_transfer', 'idx_player_transfer_player_id');
    await removeIndex('player', 'idx_player_country_id');
    await removeIndex('favorite_team', 'idx_favorite_team_user_id');
    await removeIndex('favorite_team', 'idx_favorite_team_team_id');
    await removeIndex('player_match_stats', 'idx_player_match_stats_player_id');
    await removeIndex('player_match_stats', 'idx_player_match_stats_match_id');
  },
};
