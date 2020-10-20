const  {runQuery}  =  require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS shows (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name TEXT NOT NULL,
            original_name TEXT,
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
    const sql = `SELECT * FROM shows WHERE id = ${id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO shows(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getShowsByGenre = async (id) => {
    const sql = `SELECT shows.* FROM shows inner join genre_show_mapping as gsm on shows.id = gsm.show_id WHERE gsm.genre_id = ${id} ORDER BY total_view desc LIMIT 20`;
    return await runQuery(sql);
}

const getShowsData = async () => {
    const sql = `SELECT shows.id, shows.name, shows.original_name, shows.poster_portrait_url, shows.total_episodes, shows.age_category,shows.type FROM shows `;
    return runQuery(sql);
}

const findByOriginalName = async (orignalName)=>{
    const sql = `SELECT id FROM shows WHERE original_name="${orignalName}" LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const forBanner = async () => {
    const sql = `SELECT id, name, original_name,poster_landscape_url FROM shows ORDER BY total_view desc LIMIT 10`;
    const response = await runQuery(sql);
    return response;
}

const getShowsByGroupId = async (group_id) => {
    const sql = `SELECT id,name FROM shows WHERE group_id = ${group_id} ORDER BY release_date, season`;
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

