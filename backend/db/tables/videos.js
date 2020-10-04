const  {runQuery}  =  require('../db_utils');
const createTable = (con) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS videos (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            episode_number INT,
            name TEXT,
            url TEXT,
            thumbnail_url TEXT,
            video_length TIME,
            intro_start_time TIME,
            intro_end_time TIME,
            recap_start_time TIME,
            recap_end_time TIME,
            closing_start_time TIME,
            closing_end_time TIME,
            quality INT,
            type VARCHAR(255),
            show_id BIGINT,
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
    const sql = `SELECT * from videos where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO videos(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getShows = async (id, from, to) => {
    from = from || 1;
    let sql = `SELECT * from videos where show_id = ${id} and episode_number >= ${from}`;
    sql += (to !== undefined) ? ` and episode_number <= ${to}` : "";
    sql += ` order by episode_number asc`;
    console.log(sql);
    const result = await runQuery(sql);
    return result;
}

const findByEpisodeName = async (name,show_id)=>{
    const sql = `SELECT id from videos where name="${name}" and show_id=${show_id} limit 1`;
    console.log(sql);
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

module.exports = {
    createTable,
    find,
    create,
    getShows,
    findByEpisodeName,
}
