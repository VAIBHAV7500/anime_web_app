const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS reviews (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            review TEXT,
            show_id BIGINT UNSIGNED,
            user_id BIGINT UNSIGNED,
            likes BIGINT,
            approved BOOL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(show_id) REFERENCES shows(ID),
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

const find = async (id) => {
    const sql = `SELECT * FROM reviews WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO reviews(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const findByShows = async (show_id, user_id) => {
    const sql = `SELECT reviews.*,
    users.email AS email
    FROM reviews 
    inner join users ON users.id = reviews.user_id 
    WHERE reviews.show_id = ${show_id}
     `;
    return await runQuery(sql);
}

const likeAction = async (id, like) => {
    let sql = `SELECT likes FROM reviews WHERE id = ${id} LIMIT 1`;
    const response = await runQuery(sql);
    response[0].likes += like;
    sql = `UPDATE reviews SET likes = ${response[0].likes} WHERE id = ${id}`;
    return runQuery(sql); 
} 
 
module.exports = {
    createTable,
    find,
    create,
    findByShows,
    likeAction,
}
