'use strict';

const pandaScoreService = require('../external/pandaScoreService');
const matchRepository = require('../repositories/matchRepository');

class MatchSyncService {
  async syncTodayMatches() {
    try {
      console.log('[SYNC] Start fetching PandaScore...');

      const matches = await pandaScoreService.getTodayMatches();

      if (!matches || matches.length === 0) {
        console.log('[SYNC] No matches found');
        return;
      }

      for (const m of matches) {
        await matchRepository.upsertMatch({
          match_id: m.id,
          team1_id: m.opponents?.[0]?.opponent?.id || null,
          team2_id: m.opponents?.[1]?.opponent?.id || null,
          tournament_id: m.tournament?.id || null,
          score_team1: m.results?.[0]?.score || 0,
          score_team2: m.results?.[1]?.score || 0,
          status: m.status,
          start_time: m.begin_at,
          vod_url: m.official_stream_url || null,
        });
      }

      console.log(`[SYNC] Saved ${matches.length} matches`);
    } catch (err) {
      console.error('[SYNC ERROR]', err.message);
    }
  }
}

module.exports = new MatchSyncService();
