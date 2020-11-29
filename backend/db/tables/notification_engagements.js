const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS notification_engagements(
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED,
            show_id BIGINT UNSIGNED,
            notification_id BIGINT UNSIGNED,
            read_reciept BOOLEAN,
            read_time TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(notification_id) REFERENCES notifications(ID)
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
    const sql = `SELECT * FROM notification_engagements WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO notification_engagements(${Object.keys(body).join()}) VALUES (?)`;
    return runQuery(sql, [Object.values(body)]);
}

const findUnread = async (userId) => {
  const sql = `SELECT notifications.body,notifications.link,notifications.image_url, ne.created_at FROM notification_engagements
       AS ne INNER JOIN notifications ON notifications.id = ne.notification_id
       where ne.read_reciept = false and ne.user_id = ?
       `
  return runQuery(sql,[userId]);
}


module.exports = {
    createTable,
    find,
    create,
    findUnread,
}
