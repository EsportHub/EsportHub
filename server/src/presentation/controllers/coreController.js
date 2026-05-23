// GET /api/search?q=
const db = require('../../../models/index');

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      const error = new Error('Пошуковий запит має містити мінімум 2 символи');
      error.statusCode = 400;
      error.errorCode = 'VALIDATION_ERROR';
      throw error;
    }

    const search = `%${q.trim()}%`;

    const [teams] = await db.sequelize.query(
      `SELECT team_id AS id, name, logo, description, 'team' AS type
       FROM team WHERE name LIKE :search`,
      { replacements: { search } },
    );

    const [players] = await db.sequelize.query(
      `SELECT p.player_id AS id, p.nickname AS name, p.real_name, c.name AS country, 'player' AS type
       FROM player p
       LEFT JOIN country c ON p.country_id = c.country_id
       WHERE p.nickname LIKE :search OR p.real_name LIKE :search`,
      { replacements: { search } },
    );

    const [tournaments] = await db.sequelize.query(
      `SELECT tournament_id AS id, name, start_date, end_date, prize_pool, 'tournament' AS type
       FROM tournament WHERE name LIKE :search`,
      { replacements: { search } },
    );

    res.status(200).json({
      message: 'Результати пошуку',
      query: q,
      data: { teams, players, tournaments },
    });
  } catch (error) {
    next(error);
  }
};