const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS user_ip (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            ip varchar(255) UNIQUE NOT NULL,
            user_id BIGINT UNSIGNED NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
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
    const sql = `INSERT INTO user_ip(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const findByUserId = async (userId) => {
    const sql = `SELECT ip FROM user_ip WHERE user_id = "${userId}"`;
    const result = await runQuery(sql);
    return result.length ? result : undefined;
}

const deleteIp = async (ip,userId) => {
    const sql = `DELETE FROM user_ip WHERE ip = "${ip}" AND user_id=${userId}`;
    await runQuery(sql);
}
 
module.exports = {
    createTable,
    create,    
    findByUserId,
    deleteIp,
}
