const { runQuery } = require('../db_utils');

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
    const sql = `SELECT * FROM genre WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const bulkFindCategory = async (id) => {
    const sql = `SELECT category FROM genre inner JOIN genre_show_mapping AS gsm ON genre.id = gsm.genre_id WHERE show_id = ${id}`;
    const result = await runQuery(sql);
    return result.map(x => x.category);
}

const findByGenre = async (genre) => {
    const sql = `SELECT id FROM genre WHERE category LIKE '${genre}' LIMIT 1`;
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

const attachGenres = async (shows) => {
    const show_ids = shows.map(x => x.id).join(',');
    const sql = `SELECT category, gsm.show_id FROM genre inner JOIN genre_show_mapping AS gsm ON genre.id = gsm.genre_id WHERE show_id in (${show_ids})`;
    const response = await runQuery(sql);
    shows.map((show)=>{
        show['genres'] = response.filter(x => x.show_id === show.id).map(x => x.category);
        return show;
    });
    return shows;
}

module.exports = {
    createTable,
    find,
    create,
    findByGenre,
    bulkFindCategory,
    attachGenres
}
