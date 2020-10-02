const  {runQuery}  =  require('../db_utils');

const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            password VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            status INT,
            mobile VARCHAR(15) UNIQUE,
            plan_id INT,
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
    const sql = `SELECT * from users where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const find_by_email = async (email) => {
    const sql = `SELECT * from users where email = "${email}" limit 1`;
    const result = await runQuery(sql);
    console.log(result);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO users(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql,[Object.values(body)]);
}

const doesEmailExist = async (email) => {
    const sql = `SELECT * from users where email = "${email}" limit 1`;
    const result = await runQuery(sql).catch(e=>{ return {
        status : false,
        message : "SQL ERROR"
    }});
    console.log(result);
    return result.length ? {status : true, message : "User Exist"} : {status : false, message:"User not exist"};
}


module.exports = {
    createTable,
    find,
    create,
    find_by_email,
    doesEmailExist
}

/*db = require('../index');
global.connection = db.getConnection();
body = {
    "password": "123",
    "email": "dummy@dmail.com",
    "status": 1,
    "mobile": "123456",
    "plan_id": 12,
}
user = require('./user');
user.create(body)
*/


