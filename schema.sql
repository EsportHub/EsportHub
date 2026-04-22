-- CREATE DATABASE IF NOT EXISTS EsportDB;
-- USE EsportDB;

-- -- =========================
-- -- 1. country
-- -- =========================
-- CREATE TABLE country (
--     country_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL UNIQUE,
--     code VARCHAR(10) NOT NULL UNIQUE,
--     flag VARCHAR(255) NULL,
--     description TEXT NULL
-- );

-- -- =========================
-- -- 2. city
-- -- =========================
-- CREATE TABLE city (
--     city_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     country_id INT NOT NULL,

--     CONSTRAINT fk_city_country
--         FOREIGN KEY (country_id)
--         REFERENCES country(country_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 3. team
-- -- =========================
-- CREATE TABLE team (
--     team_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL UNIQUE,
--     country_id INT NULL,
--     city_id INT NULL,
--     founded_date DATE NULL,
--     logo VARCHAR(255) NULL,
--     description TEXT NULL,

--     CONSTRAINT fk_team_country
--         FOREIGN KEY (country_id)
--         REFERENCES country(country_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_team_city
--         FOREIGN KEY (city_id)
--         REFERENCES city(city_id)
--         ON DELETE SET NULL
-- );

-- -- =========================
-- -- 4. player
-- -- =========================
-- CREATE TABLE player (
--     player_id INT AUTO_INCREMENT PRIMARY KEY,
--     nickname VARCHAR(100) NOT NULL UNIQUE,
--     real_name VARCHAR(100) NULL,
--     country_id INT NULL,
--     birth_date DATE NULL,
--     team_id INT NULL,

--     CONSTRAINT fk_player_country
--         FOREIGN KEY (country_id)
--         REFERENCES country(country_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_player_team
--         FOREIGN KEY (team_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL
-- );

-- -- =========================
-- -- 5. game
-- -- =========================
-- CREATE TABLE game (
--     game_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL UNIQUE,
--     genre VARCHAR(100) NULL,
--     developer VARCHAR(100) NULL
-- );

-- -- =========================
-- -- 6. arena
-- -- =========================
-- CREATE TABLE arena (
--     arena_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     city_id INT NULL,
--     capacity INT NULL,
--     latitude DECIMAL(9,6) NULL,
--     longitude DECIMAL(9,6) NULL,

--     CONSTRAINT fk_arena_city
--         FOREIGN KEY (city_id)
--         REFERENCES city(city_id)
--         ON DELETE SET NULL
-- );

-- -- =========================
-- -- 7. tournament
-- -- =========================
-- CREATE TABLE tournament (
--     tournament_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(150) NOT NULL,
--     game_id INT NULL,
--     arena_id INT NULL,
--     start_date DATE NOT NULL,
--     end_date DATE NOT NULL,
--     prize_pool DECIMAL(12,2) NULL,

--     CONSTRAINT fk_tournament_game
--         FOREIGN KEY (game_id)
--         REFERENCES game(game_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_tournament_arena
--         FOREIGN KEY (arena_id)
--         REFERENCES arena(arena_id)
--         ON DELETE SET NULL
-- );

-- -- =========================
-- -- 8. team_game
-- -- =========================
-- CREATE TABLE team_game (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     team_id INT NOT NULL,
--     game_id INT NOT NULL,

--     CONSTRAINT fk_team_game_team
--         FOREIGN KEY (team_id)
--         REFERENCES team(team_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_team_game_game
--         FOREIGN KEY (game_id)
--         REFERENCES game(game_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 9. tournament_team
-- -- =========================
-- CREATE TABLE tournament_team (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     tournament_id INT NOT NULL,
--     team_id INT NOT NULL,
--     place INT NULL,

--     CONSTRAINT fk_tournament_team_tournament
--         FOREIGN KEY (tournament_id)
--         REFERENCES tournament(tournament_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_tournament_team_team
--         FOREIGN KEY (team_id)
--         REFERENCES team(team_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 10. map_marker
-- -- =========================
-- CREATE TABLE map_marker (
--     marker_id INT AUTO_INCREMENT PRIMARY KEY,
--     type VARCHAR(50) NOT NULL,
--     entity_id INT NOT NULL,
--     latitude DECIMAL(9,6) NOT NULL,
--     longitude DECIMAL(9,6) NOT NULL
-- );

-- -- =========================
-- -- 11. article
-- -- =========================
-- CREATE TABLE article (
--     article_id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(200) NOT NULL,
--     content TEXT NOT NULL,
--     created_at DATETIME NOT NULL,
--     updated_at DATETIME NULL
-- );

-- -- =========================
-- -- 12. user
-- -- =========================
-- CREATE TABLE `users` (
--     user_id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(100) NOT NULL UNIQUE,
--     email VARCHAR(100) NOT NULL UNIQUE,
--     password_hash VARCHAR(255) NOT NULL,
--     theme_preference VARCHAR(10) NULL
-- );

-- -- =========================
-- -- 13. match
-- -- =========================
-- CREATE TABLE `match` (
--     match_id INT AUTO_INCREMENT PRIMARY KEY,
--     team1_id INT NULL,
--     team2_id INT NULL,
--     tournament_id INT NOT NULL,
--     score_team1 INT DEFAULT 0,
--     score_team2 INT DEFAULT 0,
--     status VARCHAR(50) NOT NULL,
--     start_time DATETIME NOT NULL,

--     CONSTRAINT fk_match_team1
--         FOREIGN KEY (team1_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_match_team2
--         FOREIGN KEY (team2_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_match_tournament
--         FOREIGN KEY (tournament_id)
--         REFERENCES tournament(tournament_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 14. match_event
-- -- =========================
-- CREATE TABLE match_event (
--     event_id INT AUTO_INCREMENT PRIMARY KEY,
--     match_id INT NOT NULL,
--     event_type VARCHAR(50) NOT NULL,
--     event_time DATETIME NOT NULL,
--     description TEXT NULL,

--     CONSTRAINT fk_match_event_match
--         FOREIGN KEY (match_id)
--         REFERENCES `match`(match_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 15. map
-- -- =========================
-- CREATE TABLE map (
--     map_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL UNIQUE,
--     game_id INT NOT NULL,

--     CONSTRAINT fk_map_game
--         FOREIGN KEY (game_id)
--         REFERENCES game(game_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 16. match_map_phase
-- -- =========================
-- CREATE TABLE match_map_phase (
--     phase_id INT AUTO_INCREMENT PRIMARY KEY,
--     match_id INT NOT NULL,
--     team_id INT NULL,
--     map_id INT NULL,
--     action_type VARCHAR(20) NOT NULL,
--     order_number INT NOT NULL,

--     CONSTRAINT fk_match_map_phase_match
--         FOREIGN KEY (match_id)
--         REFERENCES `match`(match_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_match_map_phase_team
--         FOREIGN KEY (team_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_match_map_phase_map
--         FOREIGN KEY (map_id)
--         REFERENCES map(map_id)
--         ON DELETE SET NULL
-- );

-- -- =========================
-- -- 17. player_match_stats
-- -- =========================
-- CREATE TABLE player_match_stats (
--     stats_id INT AUTO_INCREMENT PRIMARY KEY,
--     player_id INT NULL,
--     match_id INT NOT NULL,
--     kills INT DEFAULT 0,
--     deaths INT DEFAULT 0,
--     assists INT DEFAULT 0,

--     CONSTRAINT fk_player_match_stats_player
--         FOREIGN KEY (player_id)
--         REFERENCES player(player_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_player_match_stats_match
--         FOREIGN KEY (match_id)
--         REFERENCES `match`(match_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 18. favorite_team
-- -- =========================
-- CREATE TABLE favorite_team (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     team_id INT NOT NULL,
--     created_at DATETIME NOT NULL,

--     CONSTRAINT fk_favorite_team_user
--         FOREIGN KEY (user_id)
--         REFERENCES `users`(user_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_favorite_team_team
--         FOREIGN KEY (team_id)
--         REFERENCES team(team_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 19. notification
-- -- =========================
-- CREATE TABLE notification (
--     notification_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     match_id INT NOT NULL,
--     message TEXT NOT NULL,
--     send_time DATETIME NOT NULL,
--     status VARCHAR(50) NOT NULL,

--     CONSTRAINT fk_notification_user
--         FOREIGN KEY (user_id)
--         REFERENCES `users`(user_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_notification_match
--         FOREIGN KEY (match_id)
--         REFERENCES `match`(match_id)
--         ON DELETE CASCADE
-- );

-- -- =========================
-- -- 20. player_transfer
-- -- =========================
-- CREATE TABLE player_transfer (
--     transfer_id INT AUTO_INCREMENT PRIMARY KEY,
--     player_id INT NOT NULL,
--     old_team_id INT NULL,
--     new_team_id INT NULL,
--     transfer_date DATETIME NOT NULL,
--     notes TEXT NULL,

--     CONSTRAINT fk_player_transfer_player
--         FOREIGN KEY (player_id)
--         REFERENCES player(player_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_player_transfer_old_team
--         FOREIGN KEY (old_team_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_player_transfer_new_team
--         FOREIGN KEY (new_team_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL
-- );

-- -- =========================
-- -- 21. bracket_match
-- -- =========================
-- CREATE TABLE bracket_match (
--     bracket_match_id INT AUTO_INCREMENT PRIMARY KEY,
--     tournament_id INT NOT NULL,
--     round_name VARCHAR(50) NOT NULL,
--     team1_id INT NULL,
--     team2_id INT NULL,
--     winner_id INT NULL,

--     CONSTRAINT fk_bracket_match_tournament
--         FOREIGN KEY (tournament_id)
--         REFERENCES tournament(tournament_id)
--         ON DELETE CASCADE,

--     CONSTRAINT fk_bracket_match_team1
--         FOREIGN KEY (team1_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_bracket_match_team2
--         FOREIGN KEY (team2_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL,

--     CONSTRAINT fk_bracket_match_winner
--         FOREIGN KEY (winner_id)
--         REFERENCES team(team_id)
--         ON DELETE SET NULL
-- );