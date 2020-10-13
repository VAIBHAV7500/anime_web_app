const {
    runQuery
} = require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS characters (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            description TEXT,
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
    const sql = `SELECT * from characters where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

module.exports = {
    createTable,
    find,
}
