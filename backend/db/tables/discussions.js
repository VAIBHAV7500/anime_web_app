const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS discussions (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            message TEXT,
            video_id BIGINT UNSIGNED,
            user_id BIGINT UNSIGNED,
            time DOUBLE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(video_id) REFERENCES videos(ID),
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
    const sql = `SELECT * FROM discussions WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO discussions(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const findByVideo = async (video_id,from,to) => {
    const sql = `SELECT message,time,users.email,users.id, users.name as name, users.user_name as user_name FROM discussions INNER JOIN users on users.id = discussions.user_id where video_id = ? and time BETWEEN ? and ?`;
    return runQuery(sql,[video_id,from,to]);
}

 
module.exports = {
    createTable,
    find,
    create,
    findByVideo
}
