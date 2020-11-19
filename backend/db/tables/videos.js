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
            next_show BIGINT UNSIGNED,
            show_id BIGINT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY(show_id) REFERENCES shows(ID),
            FOREIGN KEY(next_show) REFERENCES shows(ID)
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
    const sql = `SELECT * FROM videos WHERE id = ? LIMIT 1`;
    const result = await runQuery(sql,[id]);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO videos(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getShows = async (id, from, to, latest) => {
    from = from || 1;
    let order = 'asc'
    if(latest){
        [from,to] = [to,from];
        order = 'desc'
    }
    let sql = `SELECT * FROM videos WHERE show_id = ${id} AND episode_number >= ${from}`;
    sql += (to !== undefined) ? ` and episode_number <= ${to}` : "";
    sql += ` order by episode_number ${order}`;
    const result = await runQuery(sql);
    return result;
}

const findByEpisodeName = async (name,show_id)=>{
    const sql = `SELECT id FROM videos WHERE name="${name}" AND show_id=${show_id} LIMIT 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const fetchRecent = async (show_id, user_id) => {
    const sql = `SELECT id, episode_number
      FROM videos LEFT JOIN user_player_sessions as ups on ups.video_id = videos.id
      WHERE videos.show_id = ? AND (ups.user_id = ? OR videos.episode_number = 1) order by episode_number desc limit 1
    `;
    return runQuery(sql,[show_id, user_id]);
}

module.exports = {
    createTable,
    find,
    create,
    getShows,
    findByEpisodeName,
    fetchRecent
}
