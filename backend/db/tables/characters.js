const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS characters (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            description TEXT,
            role TEXT,
            image_url TEXT,
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

const find = async (id) => {
    const sql = `SELECT * FROM characters WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const getCharactersByShows = async (show_id) => {
    const sql = `SELECT characters.*,csm.revealed_in FROM characters JOIN character_show_mapping AS csm ON csm.character_id = characters.id`;
    return runQuery(sql,[show_id]);
}

const create = async (body) => {
    const sql = `INSERT INTO characters(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

module.exports = {
    createTable,
    find,
    getCharactersByShows,
    create,
}
