const { runQuery } = require('../db_utils');

const createTable = (con) => {
    const sql = `
    CREATE TABLE IF NOT EXISTS banners (
        title VARCHAR(255),
        src VARCHAR(255),
        is_ad BOOLEAN DEFAULT FALSE,
        show_id VARCHAR(255) NOT NULL
        )
       ENGINE = InnoDB;
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

const getBanners = () => {
    const sql = `SELECT * FROM banners`;
    return runQuery(sql);
}

module.exports = {
    createTable,
    getBanners
}