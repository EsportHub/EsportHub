'use strict';

module.exports = (sequelize, DataTypes) => {
  const Match = sequelize.define(
    'Match',
    {
      match_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      team1_id: { type: DataTypes.INTEGER, allowNull: true },
      team2_id: { type: DataTypes.INTEGER, allowNull: true },
      tournament_id: { type: DataTypes.INTEGER, allowNull: false },
      score_team1: { type: DataTypes.INTEGER, defaultValue: 0 },
      score_team2: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: { type: DataTypes.STRING(50), allowNull: false },
      start_time: { type: DataTypes.DATE, allowNull: false },
      vod_url: { type: DataTypes.STRING(500), allowNull: true },
    },
    {
      tableName: 'match',
      timestamps: false,
    },
  );

  return Match;
};
