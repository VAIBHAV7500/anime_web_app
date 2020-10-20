const  {runQuery}  =  require('../db_utils');

const createTable = (con) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS access_tokens (
        access_token VARCHAR(60) NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        INDEX fk_access_tokens_users_idx (user_id ASC),
        PRIMARY KEY (user_id),
        CONSTRAINT fk_access_tokens_users
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
       ENGINE = InnoDB;
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

const findAccessToken = async (accessToken) => {
    const sql = `SELECT user_id from access_tokens WHERE access_token = '${accessToken}' limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO access_tokens(${Object.keys(body).join()}) VALUES (?) ON DUPLICATE KEY UPDATE access_token='${Object.values(body)[0]}'`;
    return await runQuery(sql, [Object.values(body)]);
}

module.exports = {
    createTable,
    findAccessToken,
    create,
}

