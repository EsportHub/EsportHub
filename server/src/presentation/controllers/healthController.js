const { sequelize } = require('../../../models/index');

exports.checkHealth = async (req, res) => {
  try {
    await sequelize.query('SELECT 1');

    return res.status(200).json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.status(503).json({
      status: 'Service Unavailable',
      database: 'Disconnected',
      timestamp: new Date().toISOString(),
    });
  }
};
