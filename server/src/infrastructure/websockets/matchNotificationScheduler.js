'use strict';

const cron = require('node-cron');
const matchRepository = require('../repositories/matchRepository');
const logger = require('../../utils/logger');
const { QueryTypes } = require('sequelize');
const db = require('../../../models/index');

const getSubscribedUserIds = async (team1Id, team2Id) => {
  const users = await db.sequelize.query(
    `SELECT DISTINCT user_id
     FROM favorite_team
     WHERE team_id IN (:team1Id, :team2Id)`,
    { replacements: { team1Id, team2Id }, type: QueryTypes.SELECT },
  );
  return users.map((u) => u.user_id);
};

const initMatchNotificationScheduler = (io) => {
  // Перевірка кожні 5 хвилин
  cron.schedule('*/5 * * * *', async () => {
    logger.info('Планувальник: перевірка майбутніх матчів...');

    try {
      const upcomingMatches = await matchRepository.findUpcoming(30);

      for (const match of upcomingMatches) {
        const userIds = await getSubscribedUserIds(match.team1_id, match.team2_id);

        if (userIds.length === 0) continue;

        const notification = {
          type: 'match:upcoming',
          match_id: match.match_id,
          message: `Матч ${match.team1_name} vs ${match.team2_name} починається незабаром!`,
          tournament: match.tournament_name,
          start_time: match.start_time,
        };

        for (const userId of userIds) {
          io.to(`user:${userId}`).emit('notification', notification);
          logger.info(`Планувальник: сповіщення відправлено користувачу ${userId}`);
        }
      }
    } catch (err) {
      logger.error(`Планувальник: помилка — ${err.message}`);
    }
  });

  logger.info('Планувальник сповіщень про матчі запущено');
};

module.exports = { initMatchNotificationScheduler };
