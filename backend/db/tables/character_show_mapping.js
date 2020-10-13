const {
    runQuery
} = require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS character_show_mapping (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            character_id BIGINT UNSIGNED,
            show_id BIGINT UNSIGNED,
            FOREIGN KEY(character_id) REFERENCES characters(ID),
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


module.exports = {
    createTable,
}
