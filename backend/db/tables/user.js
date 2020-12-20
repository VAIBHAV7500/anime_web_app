const  {runQuery}  =  require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            password VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            user_name VARCHAR(255) UNIQUE,
            name VARCHAR(255),
            status INT,
            mobile VARCHAR(15) UNIQUE,
            plan_id INT DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CHECK(email != '')
        )
    `;
    return new Promise((res,rej)=>{
        con.query(sql, (err, result) => {
            if (err) {
                rej(err);
            }
            res(result);
        });
    })
}

const find = async (id) =>{
    const sql = `SELECT user_name,email FROM users WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const find_by_email = async (email) => {
    const sql = `SELECT * FROM users WHERE email = "${email}" LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO users(${Object.keys(body).join()}) VALUES (?)`;
    return runQuery(sql,[Object.values(body)]);
}

const getPlan = async (id) => {
    const sql = `SELECT plan_id FROM users where id = ?`;
    return runQuery(sql,[id]);
}


module.exports = {
    createTable,
    find,
    create,
    find_by_email,
    getPlan,
}
