const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS genre_show_mapping (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            genre_id BIGINT UNSIGNED,
            show_id BIGINT UNSIGNED,
            FOREIGN KEY(genre_id) REFERENCES genre(ID),
            FOREIGN KEY(show_id) REFERENCES shows(ID)
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

const findShowsByGenre = async (genre_id) => {
    const sql = `SELECT * FROM genre_show_mapping WHERE genre_id = ${genre_id}`;
    const result = await runQuery(sql);
    return result;
}

const findGenreByShows = async (show_ids) => {
    let result = [];
    if(show_ids.length){
        const sql = `SELECT gsm.show_id, genre.category FROM genre_show_mapping as gsm INNER JOIN genre ON genre.id = gsm.genre_id WHERE show_id in (${show_ids.join(',')})`;
        result = await runQuery(sql);
    }
    return result;
}

const create = async (body) => {
    const sql = `INSERT INTO genre_show_mapping(${Object.keys(body).join()}) VALUES (?)`;
    const response = await runQuery(sql, [Object.values(body)]);
    if (response) {
        const result = await findByGenre(body.category);
        return result;
    }
}

module.exports = {
    createTable,
    create,
    findShowsByGenre,
    findGenreByShows,
}
