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

const find = async (id, genre) => {
    const sql = `SELECT * from shows where id = ${id} limit 1`;
    const result = await runQuery(sql);
    return result.length ? result[0] : undefined;
}

const create = async (body) => {
    const sql = `INSERT INTO shows(${Object.keys(body).join()}) VALUES (?)`;
    return await runQuery(sql, [Object.values(body)]);
}

const getShowsByGenre = async (id) => {
    const sql = `SELECT * from shows where genre_id like '%,${id}%,' order by total_view desc limit 20`;
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

const forBanner = async () => {
    const sql = `SELECT id, name, original_name,poster_landscape_url from shows order by total_view desc limit 10`;
    const response = await runQuery(sql);
    return response;
}

const getShowsByGroupId = async (group_id) => {
    const sql = `SELECT id,name from shows where group_id = ${group_id} order by release_date, season`;
    console.log(sql);
    const response = await runQuery(sql);
    return response;
}

module.exports = {
    createTable,
    find,
    create,
    getShowsByGenre,
    getShowsTitle,
    findByOriginalName,
    forBanner,
    getShowsByGroupId,
}
/*
<div style="display:flex;">
<div class="info_synopsis__3qJPs">Asta is a young boy who dreams of becoming the greatest mage in the kingdom. Only one problem – he can't use any magic! Luckily for Asta, he receives the incredibly rare five-leaf clover grimoire that gives him the power of anti-magic. Can someone who can't use magic really become the Wizard King? One thing's for sure – Asta will never give up!&lt;br&gt;&lt;br&gt;

(Source: VIZ Media)<a class="info_see_more__2s8rr">See More</a>
</div>
<div class="wrapper">
    <select id="cars" style="margin-left: 44px;width: 142px;padding: 2%;" onfocus="this.size=5;" size="1" onblur="this.size=1;" onchange="this.size=1; this.blur();">
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="vw">VW</option>
  <option value="audi" selected="">Audi</option>
<option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="vw">VW</option>
<option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="vw">VW</option>
<option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="vw">VW</option>
    <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="vw">VW</option>
    <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="vw">VW</option>
</select>
</div>    

</div>


    margin-left: -1px;
    width: 142px;
    padding: 2%;

*/

