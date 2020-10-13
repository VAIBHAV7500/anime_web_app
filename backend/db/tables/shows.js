const  {runQuery}  =  require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS shows (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT NOT NULL,
            original_name TEXT,
            group_id BIGINT NOT NULL,
            genre_id TEXT,
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
            total_episodes INT DEFAULT 0,
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
    const sql = `SELECT shows.* from shows inner join genre_show_mapping as gsm on shows.id = gsm.show_id where gsm.genre_id = ${id} order by total_view desc limit 20`;
    return await runQuery(sql);
}

const getShowsData = async () => {
    const sql = `SELECT shows.id, shows.name, shows.original_name, shows.poster_portrait_url, shows.total_episodes, shows.age_category,shows.type,genre_id from shows `;
    return runQuery(sql);
}

const findByOriginalName = async (orignalName)=>{
    const sql = `SELECT id from shows where original_name="${orignalName}" limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const forBanner = async () => {
    const sql = `SELECT id, name, original_name,poster_landscape_url from shows order by total_view desc limit 10`;
    const response = await runQuery(sql);
    return response;
}

const getShowsByGroupId = async (group_id) => {
    const sql = `SELECT id,name from shows where group_id = ${group_id} order by release_date, season`;
    const response = await runQuery(sql);
    return response;
}

module.exports = {
    createTable,
    find,
    create,
    getShowsByGenre,
    getShowsData,
    findByOriginalName,
    forBanner,
    getShowsByGroupId,
}

