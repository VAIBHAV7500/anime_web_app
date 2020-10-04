const  {runQuery}  =  require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS shows (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT NOT NULL,
            original_name TEXT,
            genre_id TEXT,
            group_id BIGINT NOT NULL,
            next_show_id BIGINT,
            trailer_url TEXT,
            poster_portrait_url TEXT,
            poster_landscape_url TEXT,
            season INT,
            total_view BIGINT DEFAULT 0,
            release_date DATE,
            age_category INT,
            plan_id BIGINT,
            type VARCHAR(255),
            description TEXT,
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
    const sql = `SELECT * from shows where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO shows(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getShowsByGenre = async (id) => {
    const sql = `SELECT * from shows where genre_id like '%,${id}%,'`;
    console.log(sql);
    return await runQuery(sql);
}

const getShowsTitle = async () => {
    const sql = `SELECT id, name, original_name,poster_portrait_url from shows`;
    return runQuery(sql);
}

const findByOriginalName = async (orignalName)=>{
    console.log(orignalName);
    const sql = `SELECT id from shows where original_name="${orignalName}" limit 1`;
    console.log(sql);
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const addShows = async(body)=>{
    const sql = `INSERT INTO shows(${Object.keys(body).join()}) VALUES (?)`;
    console.log(sql);
    const response =  await runQuery(sql, [Object.values(body)]);
    if(response){
        const result = await findByOriginalName(body.original_name);
        console.log(result);
        return result;
    }
}

module.exports = {
    createTable,
    find,
    create,
    getShowsByGenre,
    getShowsTitle,
    findByOriginalName,
    addShows
}
