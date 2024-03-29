const { runQuery } = require('../db_utils');

const COMPLETE_PERCENTAGE_SPLIT = 80;

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS user_player_sessions (
            show_id BIGINT UNSIGNED,
            video_id BIGINT UNSIGNED PRIMARY KEY,
            user_id BIGINT UNSIGNED,
            covered_percentage DOUBLE DEFAULT 0.0,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(video_id) REFERENCES videos(ID),
            FOREIGN KEY(show_id) REFERENCES shows(ID),
            FOREIGN KEY(user_id) REFERENCES users(ID)
        )
    `;
    return new Promise((res, rej) => {
        con.query(sql, (err, result) => {
            if (err) {
                rej(err);
            }
            res(result);
        });
    })
}

const create = async (body) => {
    const sql = `INSERT INTO user_player_sessions(${Object.keys(body).join()}) VALUES (?)`;
    return runQuery(sql, [Object.values(body)]);
}

const upsertRecord = async (body) => {
    const sql = `REPLACE INTO user_player_sessions(${Object.keys(body).join()}) VALUES (?)`;
    return runQuery(sql, [Object.values(body)]);
}

const findByShowId = async(show_id, user_id) => {
    const sql = `SELECT covered_percentage, video_id FROM user_player_sessions WHERE show_id = ? and user_id = ?`;
    return runQuery(sql,[show_id, user_id]);
}

const findByVideoId = async (video_id, userId) => {
    const sql = `SELECT covered_percentage FROM user_player_sessions WHERE video_id = ? and user_id = ?`;
    return runQuery(sql,[video_id, userId]);
}

const findByUserId = async (userId) => {
    const sql = `SELECT shows.id as id,shows.name as name, ups.video_id, videos.episode_number, shows.total_episodes, ups.covered_percentage, shows.description as description, shows.poster_landscape_url as poster  FROM user_player_sessions as ups inner join shows ON shows.id = ups.show_id inner join videos on videos.id = ups.video_id WHERE user_id = ? group by shows.name having (videos.episode_number <> shows.total_episodes or covered_percentage < ${COMPLETE_PERCENTAGE_SPLIT});`;
    return runQuery(sql,[userId]);
}

const completedShows = async (userId) => {
    const sql = `SELECT shows.id as id,shows.name as name, ups.video_id, videos.episode_number, shows.total_episodes, ups.covered_percentage, shows.description as description, shows.poster_landscape_url as poster FROM user_player_sessions as ups inner join shows ON shows.id = ups.show_id inner join videos on videos.id = ups.video_id WHERE user_id = ? group by shows.name having (videos.episode_number = shows.total_episodes and covered_percentage >= ${COMPLETE_PERCENTAGE_SPLIT});`;
    return runQuery(sql,[userId]); 
}

module.exports = {
    createTable,
    create,
    findByShowId,
    findByVideoId,
    upsertRecord,
    findByUserId,
    completedShows,
}
