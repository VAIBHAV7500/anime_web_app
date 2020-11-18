const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS watchlist (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED NOT NULL,
            show_id BIGINT UNSIGNED NOT NULL,
            image_url TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (show_id) REFERENCES shows(id),
            UNIQUE KEY(user_id,show_id),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    const sql = `INSERT INTO watchlist(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getAllShowIdByUserId = async (userId) => {
    const sql = `SELECT shows.id as id,
        shows.name as name,
        shows.description as description,
        shows.poster_landscape_url as poster
        FROM watchlist
        INNER JOIN shows ON shows.id = watchlist.show_id 
        WHERE user_id = ?
    `;
    const result = await runQuery(sql,[userId]);
    return result;   
}

const deleteRecord = async (show_id, user_id) => {
    const sql = `DELETE FROM watchlist WHERE show_id = ? AND user_id = ?`;
    return runQuery(sql,[show_id,user_id]);
}

const exists = async (show_id, user_id) => {
    const sql = `SELECT id from watchlist where show_id = ? and user_id = ? limit 1`;
    const result = await runQuery(sql, [show_id, user_id]);
    return result.length !== 0 ? true : false; 
}

module.exports = {
    createTable,
    create,
    getAllShowIdByUserId,
    deleteRecord,
    exists
}
