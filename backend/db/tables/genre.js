const {
    runQuery
} = require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS genre (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(255),
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
    const sql = `SELECT * from genre where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const bulkFindCategory = async (id) => {
    const sql = `SELECT category from genre inner join genre_show_mapping as gsm on genre.id = gsm.genre_id where show_id = ${id}`;
    const result = await runQuery(sql);
    return result.map(x => x.category);
}

const findByGenre = async (genre) => {
    const sql = `SELECT id from genre where category like '${genre}' limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO genre(${Object.keys(body).join()}) VALUES (?)`;
    const response =  await runQuery(sql, [Object.values(body)]);
    if(response){
        const result = await findByGenre(body.category);
        return result;
    }
}

module.exports = {
    createTable,
    find,
    create,
    findByGenre,
    bulkFindCategory,
}
