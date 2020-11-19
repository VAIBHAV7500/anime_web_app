const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS currently_watching (
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
    const sql = `INSERT INTO currently_watching(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getAllShowIdByUserId = async (userId) => {
    const sql = `SELECT shows.id as id,
        shows.name as name,
        shows.description as description,
        shows.poster_landscape_url as poster
        FROM currently_watching
        INNER JOIN shows ON shows.id = currently_watching.show_id 
        WHERE user_id = ?
    `;
    const result = await runQuery(sql,[userId]);
    return result;   
}


module.exports = {
    createTable,
    create,
    getAllShowIdByUserId,
}
