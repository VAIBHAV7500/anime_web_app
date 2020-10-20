const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS user_review (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            show_id BIGINT UNSIGNED,
            review_id BIGINT UNSIGNED,
            user_id BIGINT UNSIGNED,
            FOREIGN KEY(review_id) REFERENCES reviews(ID),
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

const create = async (body) => {
    const sql = `INSERT INTO user_review(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const deleteRecord = async (id, user_id) => {
    const sql = `DELETE FROM user_review WHERE review_id = ${id} AND user_id = ${user_id}`;
    return runQuery(sql);
}

const findReviewByUser = (ids, user_id) => {
    const sql = `SELECT review_id FROM user_review WHERE review_id IN (${ids.join(',')}) AND user_id = ${user_id}`;
    return runQuery(sql);
}

module.exports = {
    createTable,
    create,
    deleteRecord,
    findReviewByUser
}
