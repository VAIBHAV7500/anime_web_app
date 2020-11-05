var db = require('../db');
const {
    runQuery
} = require('../db/db_utils');
global.connection = db.getConnection();

(async ()=>{
    let sql = `SELECT id from shows`;
    let result = await runQuery(sql);

    console.log(result);
    result.forEach(async (row) => {
        const id = row.id;
        sql = `SELECT count(*) as count from videos where show_id = ${id}`;
        result = await runQuery(sql);
        const episodes = result[0].count;
        sql = `UPDATE animeApp.shows set total_episodes = ${episodes} where id = ${id} `;
        result = await runQuery(sql);
        console.log(`Updated ${episodes} episodes for show id: ${id}`);
    });
})();