'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    // Якщо дані вже є — пропускаємо
    const [rows] = await queryInterface.sequelize.query('SELECT 1 FROM country LIMIT 1');
    if (rows.length > 0) {
      console.log('Seeds already applied, skipping.');
      return;
    }

    console.log('Inserting data...');

    // COUNTRY
    await queryInterface.bulkInsert('country', [
      { name: 'Ukraine', code: 'UA', flag: 'uk', description: 'Eastern Europe country' },
      { name: 'USA', code: 'US', flag: 'us', description: 'North America country' },
      { name: 'Denmark', code: 'DK', flag: 'dk', description: 'Scandinavian country' },
      { name: 'France', code: 'FR', flag: 'fr', description: 'Western Europe country' },
      { name: 'Germany', code: 'DE', flag: 'de', description: 'Western Europe country' },
      { name: 'South Korea', code: 'KR', flag: 'kr', description: 'East Asia country' },
      { name: 'Sweden', code: 'SE', flag: 'se', description: 'Scandinavian country' },
      { name: 'Brazil', code: 'BR', flag: 'br', description: 'South America country' },
      { name: 'Australia', code: 'AU', flag: 'au', description: 'Oceania country' },
    ]);

    // CITY
    await queryInterface.bulkInsert('city', [
      { name: 'Kyiv', country_id: 1 },
      { name: 'New York', country_id: 2 },
      { name: 'Copenhagen', country_id: 3 },
      { name: 'Paris', country_id: 4 },
      { name: 'Berlin', country_id: 5 },
      { name: 'Seoul', country_id: 6 },
      { name: 'Stockholm', country_id: 7 },
      { name: 'São Paulo', country_id: 8 },
      { name: 'Sydney', country_id: 9 },
    ]);

    // GAME
    await queryInterface.bulkInsert('game', [
      { name: 'CS2', genre: 'FPS', developer: 'Valve' },
      { name: 'Dota 2', genre: 'MOBA', developer: 'Valve' },
    ]);

    await queryInterface.bulkInsert('map', [
      { name: 'Mirage', game_id: 1 },
      { name: 'Inferno', game_id: 1 },
      { name: 'Dust2', game_id: 1 },
      { name: 'Nuke', game_id: 1 },
      { name: 'Ancient', game_id: 1 },
      { name: 'Anubis', game_id: 1 },
      { name: 'Vertigo', game_id: 1 },
    ]);

    // ARENA
    await queryInterface.bulkInsert('arena', [
      { name: 'PGL Arena', city_id: 3, capacity: 5000, latitude: 55.6761, longitude: 12.5683 },
      { name: 'ESL Arena', city_id: 2, capacity: 3000, latitude: 40.7128, longitude: -74.006 },
    ]);

    // TEAM
    await queryInterface.bulkInsert('team', [
      {
        name: 'Natus Vincere',
        country_id: 1,
        city_id: 1,
        founded_date: '2009-12-17',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Natus_Vincere_Logo.png',
        description: 'Ukrainian esports organization',
      },
      {
        name: 'Team Liquid',
        country_id: 2,
        city_id: 2,
        founded_date: '2000-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Team_Liquid_logo.png',
        description: 'American esports organization',
      },
      {
        name: 'Astralis',
        country_id: 3,
        city_id: 3,
        founded_date: '2016-01-16',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Astralis_logo.png',
        description: 'Danish esports organization',
      },
      {
        name: 'Team Vitality',
        country_id: 4,
        city_id: 4,
        founded_date: '2013-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Team_Vitality_Logo.svg/1200px-Team_Vitality_Logo.svg.png',
        description: 'French esports organization',
      },
      // CS2
      {
        name: 'FaZe Clan',
        country_id: 2,
        city_id: 2,
        founded_date: '2010-01-30',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/FaZe_Clan_logo.svg/1200px-FaZe_Clan_logo.svg.png',
        description: 'American esports organization',
      },
      {
        name: 'G2 Esports',
        country_id: 4,
        city_id: 4,
        founded_date: '2014-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/G2_Esports_Logo.svg/1200px-G2_Esports_Logo.svg.png',
        description: 'European esports organization',
      },
      {
        name: 'MOUZ',
        country_id: 5,
        city_id: 5,
        founded_date: '1999-11-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Mousesports_logo.svg/1200px-Mousesports_logo.svg.png',
        description: 'German esports organization',
      },
      {
        name: 'Heroic',
        country_id: 3,
        city_id: 3,
        founded_date: '2017-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Heroic_Esports_logo.svg/1200px-Heroic_Esports_logo.svg.png',
        description: 'Danish esports organization',
      },
      {
        name: 'fnatic',
        country_id: 7,
        city_id: 7,
        founded_date: '2004-07-23',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Fnatic_2020_logo.svg/1200px-Fnatic_2020_logo.svg.png',
        description: 'Swedish esports organization',
      },
      // Dota 2
      {
        name: 'Evil Geniuses',
        country_id: 2,
        city_id: 2,
        founded_date: '1999-07-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Evil_Geniuses_logo.svg/1200px-Evil_Geniuses_logo.svg.png',
        description: 'American esports organization',
      },
      {
        name: 'Tundra Esports',
        country_id: 4,
        city_id: 4,
        founded_date: '2020-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tundra_Esports_logo.svg/1200px-Tundra_Esports_logo.svg.png',
        description: 'European esports organization',
      },
      {
        name: 'Gaimin Gladiators',
        country_id: 5,
        city_id: 5,
        founded_date: '2021-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Gaimin_Gladiators_logo.svg/1200px-Gaimin_Gladiators_logo.svg.png',
        description: 'German esports organization',
      },
      {
        name: 'Liquid Dota',
        country_id: 2,
        city_id: 2,
        founded_date: '2012-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Team_Liquid_logo.png',
        description: 'American esports organization',
      },
      {
        name: 'OG Esports',
        country_id: 4,
        city_id: 4,
        founded_date: '2016-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/OG_Esports_logo.svg/1200px-OG_Esports_logo.svg.png',
        description: 'European esports organization',
      },
      {
        name: 'Team Secret',
        country_id: 4,
        city_id: 4,
        founded_date: '2014-07-17',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Team_Secret_logo.svg/1200px-Team_Secret_logo.svg.png',
        description: 'European esports organization',
      },
      {
        name: 'PSG.LGD',
        country_id: 1,
        city_id: 1,
        founded_date: '2009-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/PSG.LGD_logo.svg/1200px-PSG.LGD_logo.svg.png',
        description: 'Chinese esports organization',
      },
      // Valorant
      {
        name: 'Sentinels',
        country_id: 2,
        city_id: 2,
        founded_date: '2018-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Sentinels_logo.svg/1200px-Sentinels_logo.svg.png',
        description: 'American esports organization',
      },
      {
        name: 'Cloud9',
        country_id: 2,
        city_id: 2,
        founded_date: '2012-09-16',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Cloud9_Logo.svg/1200px-Cloud9_Logo.svg.png',
        description: 'American esports organization',
      },
      {
        name: 'LOUD',
        country_id: 9,
        city_id: 9,
        founded_date: '2021-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/LOUD_Gaming_logo.svg/1200px-LOUD_Gaming_logo.svg.png',
        description: 'Brazilian esports organization',
      },
      // League of Legends
      {
        name: 'T1',
        country_id: 6,
        city_id: 6,
        founded_date: '2002-02-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/T1_esports_logo.svg/1200px-T1_esports_logo.svg.png',
        description: 'Korean esports organization',
      },
      {
        name: 'Gen.G Esports',
        country_id: 6,
        city_id: 6,
        founded_date: '2017-09-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Gen.G_Esports_logo.svg/1200px-Gen.G_Esports_logo.svg.png',
        description: 'Korean esports organization',
      },
      {
        name: 'Team Liquid Honda',
        country_id: 2,
        city_id: 2,
        founded_date: '2000-01-01',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Team_Liquid_logo.png',
        description: 'American esports organization',
      },
    ]);

    // TOURNAMENT
    await queryInterface.bulkInsert('tournament', [
      {
        name: 'PGL Major Copenhagen 2024',
        game_id: 1,
        arena_id: 1,
        start_date: '2024-03-17',
        end_date: '2024-03-31',
        prize_pool: 1250000.0,
      },
      {
        name: 'ESL One New York 2024',
        game_id: 2,
        arena_id: 2,
        start_date: '2024-09-01',
        end_date: '2024-09-08',
        prize_pool: 500000.0,
      },
    ]);

    // PLAYER
    await queryInterface.bulkInsert('player', [
      {
        nickname: 's1mple',
        real_name: 'Oleksandr Kostyliev',
        country_id: 1,
        birth_date: '1997-10-02',
        team_id: 1,
      },
      {
        nickname: 'electroNic',
        real_name: 'Denis Sharipov',
        country_id: 1,
        birth_date: '1998-07-15',
        team_id: 1,
      },
      {
        nickname: 'ZywOo',
        real_name: 'Mathieu Herbaut',
        country_id: 4,
        birth_date: '2000-11-09',
        team_id: 4,
      },
      {
        nickname: 'device',
        real_name: 'Nicolai Reedtz',
        country_id: 3,
        birth_date: '1996-09-08',
        team_id: 3,
      },
      {
        nickname: 'nitr0',
        real_name: 'Nick Cannella',
        country_id: 2,
        birth_date: '1995-08-14',
        team_id: 2,
      },
    ]);

    // PLAYER TRANSFERS
    await queryInterface.bulkInsert('player_transfer', [
      // s1mple — повна кар'єра
      {
        player_id: 1,
        from_team_id: null,
        to_team_id: 1,
        transfer_date: '2016-08-17',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Підписання з Natus Vincere',
      },
      {
        player_id: 1,
        from_team_id: 1,
        to_team_id: 2,
        transfer_date: '2022-01-10',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Оренда до Team Liquid',
      },
      {
        player_id: 1,
        from_team_id: 2,
        to_team_id: 1,
        transfer_date: '2022-07-01',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Повернення до NaVi',
      },

      // electroNic
      {
        player_id: 2,
        from_team_id: null,
        to_team_id: 1,
        transfer_date: '2018-03-12',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Підписання з Natus Vincere',
      },

      // ZywOo — кілька переходів
      {
        player_id: 3,
        from_team_id: null,
        to_team_id: 4,
        transfer_date: '2018-10-01',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Підписання з Team Vitality',
      },
      {
        player_id: 3,
        from_team_id: 4,
        to_team_id: 2,
        transfer_date: '2023-08-15',
        transfer_fee: 1200000,
        status: 'confirmed',
        notes: 'Перехід до Team Liquid',
      },
      {
        player_id: 3,
        from_team_id: 2,
        to_team_id: 4,
        transfer_date: '2024-02-01',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Повернення до Vitality',
      },

      // device — найкрасивіша хронологія для демо
      {
        player_id: 4,
        from_team_id: null,
        to_team_id: 3,
        transfer_date: '2013-06-01',
        transfer_fee: null,
        status: 'confirmed',
        notes: "Початок кар\'єри в Astralis",
      },
      {
        player_id: 4,
        from_team_id: 3,
        to_team_id: 2,
        transfer_date: '2021-01-11',
        transfer_fee: 850000,
        status: 'confirmed',
        notes: 'Перехід до Team Liquid',
      },
      {
        player_id: 4,
        from_team_id: 2,
        to_team_id: 3,
        transfer_date: '2022-06-30',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Повернення до Astralis',
      },
      {
        player_id: 4,
        from_team_id: 3,
        to_team_id: 4,
        transfer_date: '2024-01-20',
        transfer_fee: 500000,
        status: 'confirmed',
        notes: 'Перехід до Team Vitality',
      },

      // nitr0
      {
        player_id: 5,
        from_team_id: null,
        to_team_id: 2,
        transfer_date: '2019-05-01',
        transfer_fee: null,
        status: 'confirmed',
        notes: 'Підписання з Team Liquid',
      },
      {
        player_id: 5,
        from_team_id: 2,
        to_team_id: 1,
        transfer_date: '2023-03-10',
        transfer_fee: 300000,
        status: 'confirmed',
        notes: 'Перехід до NaVi',
      },
    ]);
    // MATCH
    await queryInterface.bulkInsert('match', [
      {
        team1_id: 1,
        team2_id: 2,
        tournament_id: 1,
        score_team1: 2,
        score_team2: 0,
        status: 'finished',
        start_time: '2024-03-17 14:00:00',
      },
      {
        team1_id: 3,
        team2_id: 4,
        tournament_id: 1,
        score_team1: 1,
        score_team2: 2,
        status: 'finished',
        start_time: '2024-03-17 17:00:00',
      },
      {
        team1_id: 2,
        team2_id: 3,
        tournament_id: 1,
        score_team1: 0,
        score_team2: 2,
        status: 'finished',
        start_time: '2024-03-18 14:00:00',
      },
      {
        team1_id: 1,
        team2_id: 4,
        tournament_id: 1,
        score_team1: 2,
        score_team2: 1,
        status: 'finished',
        start_time: '2024-03-18 17:00:00',
      },
      {
        team1_id: 1,
        team2_id: 3,
        tournament_id: 1,
        score_team1: 2,
        score_team2: 0,
        status: 'finished',
        start_time: '2024-03-20 14:00:00',
      },
      {
        team1_id: 4,
        team2_id: 2,
        tournament_id: 1,
        score_team1: 2,
        score_team2: 1,
        status: 'finished',
        start_time: '2024-03-21 16:00:00',
      },
      {
        team1_id: 1,
        team2_id: 4,
        tournament_id: 1,
        score_team1: 0,
        score_team2: 0,
        status: 'upcoming',
        start_time: '2026-06-01 15:00:00',
      },
    ]);

    // BRACKET
    await queryInterface.bulkInsert('bracket_match', [
      {
        tournament_id: 1,
        match_id: 1,
        round: 1,
        position: 1,
        next_bracket_match_id: null,
      },
      {
        tournament_id: 1,
        match_id: 2,
        round: 1,
        position: 2,
        next_bracket_match_id: null,
      },
      {
        tournament_id: 1,
        match_id: 3,
        round: 1,
        position: 3,
        next_bracket_match_id: null,
      },
      {
        tournament_id: 1,
        match_id: 4,
        round: 1,
        position: 4,
        next_bracket_match_id: null,
      },
      {
        tournament_id: 1,
        match_id: 5,
        round: 2,
        position: 1,
        next_bracket_match_id: null,
      },
      {
        tournament_id: 1,
        match_id: 6,
        round: 2,
        position: 2,
        next_bracket_match_id: null,
      },
      {
        tournament_id: 1,
        match_id: 7,
        round: 3,
        position: 1,
        next_bracket_match_id: null,
      },
    ]);

    await queryInterface.sequelize.query(
      'UPDATE bracket_match SET next_bracket_match_id = 5 WHERE bracket_match_id IN (1, 2)',
    );
    await queryInterface.sequelize.query(
      'UPDATE bracket_match SET next_bracket_match_id = 6 WHERE bracket_match_id IN (3, 4)',
    );
    await queryInterface.sequelize.query(
      'UPDATE bracket_match SET next_bracket_match_id = 7 WHERE bracket_match_id IN (5, 6)',
    );

    // MATCH MAP PHASE (pick/ban)
    await queryInterface.bulkInsert('match_map_phase', [
      { match_id: 1, team_id: 1, map_id: 3, action_type: 'ban', order_number: 1 },
      { match_id: 1, team_id: 3, map_id: 5, action_type: 'ban', order_number: 2 },
      { match_id: 1, team_id: 1, map_id: 1, action_type: 'pick', order_number: 3 },
      { match_id: 1, team_id: 3, map_id: 2, action_type: 'pick', order_number: 4 },
      { match_id: 1, team_id: 1, map_id: 6, action_type: 'ban', order_number: 5 },
      { match_id: 1, team_id: 3, map_id: 7, action_type: 'ban', order_number: 6 },
      { match_id: 1, team_id: null, map_id: 4, action_type: 'left', order_number: 7 },
    ]);

    // PLAYER MATCH STATS
    await queryInterface.bulkInsert('player_match_stats', [
      { player_id: 1, match_id: 1, kills: 28, deaths: 12, assists: 5 },
      { player_id: 2, match_id: 1, kills: 20, deaths: 15, assists: 8 },
      { player_id: 4, match_id: 1, kills: 14, deaths: 22, assists: 3 },
      { player_id: 5, match_id: 2, kills: 18, deaths: 19, assists: 7 },
      { player_id: 3, match_id: 2, kills: 25, deaths: 10, assists: 6 },
    ]);

    // USERS
    const passwordHash = await bcrypt.hash('123456', 10);
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@test.com',
        password_hash: passwordHash,
        theme_preference: 'dark',
      },
      {
        username: 'user1',
        email: 'user1@test.com',
        password_hash: passwordHash,
        theme_preference: 'light',
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('player_transfer', null, {});
    await queryInterface.bulkDelete('bracket_match', null, {});
    await queryInterface.bulkDelete('player_match_stats', null, {});
    await queryInterface.bulkDelete('match', null, {});
    await queryInterface.bulkDelete('player', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('tournament', null, {});
    await queryInterface.bulkDelete('team', null, {});
    await queryInterface.bulkDelete('arena', null, {});
    await queryInterface.bulkDelete('game', null, {});
    await queryInterface.bulkDelete('city', null, {});
    await queryInterface.bulkDelete('country', null, {});
    await queryInterface.bulkDelete('match_map_phase', null, {});
    await queryInterface.bulkDelete('map', null, {});
  },
};
