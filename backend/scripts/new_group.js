var db = require('../db');
const {
    runQuery
} = require('../db/db_utils');
global.connection = db.getConnection();


const groups = [
'Food Wars',
'One-Punch Man',
'Naruto',
'My Hero Academia',
'Attack on Titan',
'Haikyu',
'Assassination Classroom',
'Berserk',
'KONOSUBA',
'To Love Ru',
 'Seven Deadly Sins',
 'Hunter x Hunter',
 'Tsugumomo',
 'Bungo Stray Dogs',
 'Code Geass',
 'Re:ZERO',
  'Konosuba',
  'Sword Art',
  'Hunter',
  'Fruits Basket',
  'Bungo Stray Dogs',
  'High School',
  'Overlord',
  'Kakegurui',,
  'Fairy Tail',
  'Nisekoi',
  

];

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

// const type = ['manga canon','filler','mixed canon'];


// (async () => {
//     let sql = `SELECT id, name from videos`;
//     let rows = await runQuery(sql);
//     rows.forEach(async (row)=>{
//         const random = Math.floor(Math.random() * 3);
//         const value = type[random];
//         sql = `UPDATE animeApp.videos set type = '${value}' where id = ${row.id}`;
//         result = await runQuery(sql);
//         console.log(`Episode: ${row.name} | Type: ${value}`);
//     });
// })();
