'use strict';

const transferRepository = require('../../infrastructure/repositories/transferRepository');

class TransferService {
  async getPlayerTransfers(playerId) {
    const rows = await transferRepository.findByPlayer(playerId);

    if (!rows.length) {
      const error = new Error('Історію трансферів не знайдено');
      error.statusCode = 404;
      error.errorCode = 'NOT_FOUND';
      throw error;
    }

    return rows.map((r) => ({
      transferId: r.transfer_id,
      transferDate: r.transfer_date,
      transferFee: r.transfer_fee,
      status: r.status,
      notes: r.notes,
      player: {
        id: r.player_id,
        nickname: r.nickname,
        realName: r.real_name,
      },
      fromTeam: r.from_team_id
        ? { id: r.from_team_id, name: r.from_team_name, logo: r.from_team_logo }
        : null,
      toTeam: r.to_team_id
        ? { id: r.to_team_id, name: r.to_team_name, logo: r.to_team_logo }
        : null,
    }));
  }
}

module.exports = new TransferService();
