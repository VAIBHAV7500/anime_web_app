const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS user_player_sessions (
            show_id BIGINT UNSIGNED,
            video_id BIGINT UNSIGNED PRIMARY KEY,
            user_id BIGINT UNSIGNED,
            covered_percentage DOUBLE DEFAULT 0.0,
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
    console.log(sql);
    return runQuery(sql, [Object.values(body)]);
}

const findByShowId = async(show_id) => {
    const sql = `SELECT covered_percentage, video_id FROM user_player_sessions where show_id = ?`;
    return runQuery(sql,[show_id]);
}

const findByVideoId = async (video_id) => {
    const sql = `SELECT covered_percentage FROM user_player_sessions where video_id = ?`;
    return runQuery(sql,[video_id]);
}

module.exports = {
    createTable,
    create,
    findByShowId,
    findByVideoId,
    upsertRecord,
}
