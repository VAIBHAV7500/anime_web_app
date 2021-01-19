var db = require('../db');
const {
    runQuery
} = require('../db/db_utils');
global.connection = db.getConnection();


(async ()=>{
  let sql = `SELECT id,name FROM animeApp.shows where group_id = 0`;
  let result = await runQuery(sql);
  result.forEach(async (row) => {
      let name = row.name;
      sql = `INSERT INTO animeApp.show_group(name) VALUES('${name}')`;
        result = await runQuery(sql);
        group_id = result.insertId;
      sql = `UPDATE animeApp.shows set group_id = ${group_id} where name like '%${name}%' `;
      result = await runQuery(sql);
  });
})();
