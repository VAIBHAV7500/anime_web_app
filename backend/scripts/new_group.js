var db = require('../db');
const {
    runQuery
} = require('../db/db_utils');
global.connection = db.getConnection();


const groups = ['One-Punch Man', 'Naruto', 'My Hero Academia', 'Attack on Titan', 'Haikyu', 'Assassination Classroom'];

groups.forEach(async (group) => {
    let sql = `SELECT id FROM animeApp.show_group where name = '${group}'`;
    let result = await runQuery(sql);
    let group_id = 0;
    if (result.length) {
        group_id = result[0].id;
    } else {
        sql = `INSERT INTO animeApp.show_group(name) VALUES('${group}')`;
        result = await runQuery(sql);
        group_id = result.insertId;
    }
    sql = `UPDATE animeApp.shows set group_id = ${group_id} where name like '%${group}%' `;
    result = await runQuery(sql);
    console.log(`Updated Show \n Group ${group} \n Group Id: ${group_id} \n Message: ${result.message}`);
});