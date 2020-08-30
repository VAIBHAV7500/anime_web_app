const mysql = require('mysql');
const dbConfig = require('../config/dbConfig.json');
const user = require('./tables/user');
const sessions = require('./tables/sessions');
const plans = require('./tables/plan');
const genre = require('./tables/genre');
const shows = require('./tables/shows');
const videos = require('./tables/videos');
const audios = require('./tables/audios');
const subtitles = require('./tables/subtitles');

var con = mysql.createConnection({
    host: dbConfig.db_url,
    user: dbConfig.user,
    password: dbConfig.password
});

const db_name = dbConfig.db_name;

const createDB = async () => {
    return new Promise((res,rej)=>{
        con.query(`CREATE DATABASE IF NOT EXISTS ${db_name}`, (err, result) => {
            if(err) rej(err);
            con.query(`USE ${db_name}`, (err, result) => {
                if(err) rej(err);
                res(result);
            });
        });
    })
}

con.connect(async (err)=>{
    if(err){
        throw err;
    }
    try
    {
        console.log("DB CONNECTION BUILT!!");
        let response = "";
        response = await createDB();
        console.log(response);
        response = await user.createTable(con);
        console.log(response);
        response = await sessions.createTable(con);
        console.log(response);
        response = await plans.createTable(con);
        console.log(response);
        response = await genre.createTable(con);
        console.log(response);
        response = await shows.createTable(con);
        console.log(response);
        response = await videos.createTable(con);
        console.log(response);
        response = await audios.createTable(con);
        console.log(response);
        response = await subtitles.createTable(con);
        console.log(response);
    }
    catch(err){
        console.log(err);
    }

    con.end();
});
