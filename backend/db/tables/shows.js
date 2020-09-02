const  {runQuery}  =  require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS shows (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT,
            genre_id JSON,
            trailer_url TEXT,
            poster_portrait_url TEXT,
            poster_landscape_url TEXT,
            season INT,
            total_view BIGINT,
            release_date DATE,
            age_category INT,
            plan_id BIGINT,
            type VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    return new Promise((res, rej) => {
        con.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                rej(err);
            }
            res(result);
        });
    })
}

const find = async (id) => {
    const sql = `SELECT * from shows where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO shows(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

module.exports = {
    createTable,
    find,
    create,
}
