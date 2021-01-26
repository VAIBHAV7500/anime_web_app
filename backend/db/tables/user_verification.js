const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS user_verification (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED,
            verification_token TEXT,
            temp_password VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    const sql = `INSERT INTO user_verification(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const find = (user_id) => {
  const sql = `SELECT verification_token FROM user_verification where user_id = ? limit 1`;
  return runQuery(sql,[user_id]);
}

const destroyByDate = async (date) => {
  const sql = `DELETE FROM user_verification where created_at < DATE(?)`;
  return runQuery(sql,[date]);
}

const destroy = (user_id) =>{
    const sql = `DELETE FROM user_verification WHERE user_id = ?`;
    return runQuery(sql,[user_id]);
}

module.exports = {
    createTable,
    create,
    find,
    destroyByDate,
    destroy
}
