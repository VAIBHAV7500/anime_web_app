const  {runQuery}  =  require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS videos (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT,
            url TEXT,
            video_length TIME,
            intro_start_time TIME,
            intro_end_time TIME,
            recap_start_time TIME,
            recap_end_time TIME,
            closing_start_time TIME,
            closing_end_time TIME,
            quality INT,
            type VARCHAR(255),
            show_id BIGINT,
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
    const sql = `SELECT * from videos where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO videos(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

module.exports = {
    createTable,
    find,
    create,
}
