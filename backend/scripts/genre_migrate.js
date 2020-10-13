var db = require('../db');
const {
    runQuery
} = require('../db/db_utils');
const genre = require('../db/tables/genre');
global.connection = db.getConnection();

(async ()=>{
    let sql = `SELECT id,genre_id FROM animeApp.shows`;
    const result = await runQuery(sql);
    console.log(result);
    result.forEach(async (row) => {
        let genres = row.genre_id;
        genres = genres.trim(',');
        genres = genres.trim();
        const arr = genres.split(',');
        console.log(arr);
        arr.forEach(async (data)=>{
            if(data){
                sql = `INSERT INTO genre_show_mapping(genre_id, show_id) VALUES(${data},${row.id})`;
                const results = await runQuery(sql);
            }
        });
    })
})();