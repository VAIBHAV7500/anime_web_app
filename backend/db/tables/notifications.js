const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS notifications(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            image_url TEXT,
            body TEXT,
            link TEXT,
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
    const sql = `SELECT * FROM notifications WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO notifications(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}


module.exports = {
    createTable,
    find,
    create,
}
