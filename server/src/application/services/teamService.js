'use strict';

const teamRepository = require('../../infrastructure/repositories/teamRepository');

class TeamService {
  async getAllTeams() {
    const teams = await teamRepository.findAll();
    return teams;
  }

  async getTeamById(id) {
    const team = await teamRepository.findById(id);
    if (!team) {
      const error = new Error('Команду не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }
    return team;
  }
}

module.exports = new TeamService();
