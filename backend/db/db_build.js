const mysql = require('mysql');
const dbConfig = require('../config/dbConfig.json');
const fs = require('fs');
const user = require('./tables/user');
const sessions = require('./tables/sessions');
const plans = require('./tables/plan');
const genre = require('./tables/genre');
const shows = require('./tables/shows');
const videos = require('./tables/videos');
const audios = require('./tables/audios');
const subtitles = require('./tables/subtitles');
const access_tokens = require('./tables/access_tokens');
const group = require('./tables/group');
const genre_show_mapping = require('./tables/genre_show_mapping');
const characters = require('./tables/characters');
const character_show_mapping = require('./tables/character_show_mapping');
const reviews = require('./tables/reviews');
const user_review = require('./tables/user_review');
const user_ip = require('./tables/user_ip');
const completed_shows = require('./tables/completed_shows');
const currently_watching = require('./tables/currently_watching');
const watchlist = require('./tables/watchlist');
const user_player_session = require('./tables/user_player_session');


var con = mysql.createConnection({
    host: dbConfig.db_url,
    user: dbConfig.user,
    password: dbConfig.password
});

const migrationFolder = `./db/migrations`;
const tablesFolder = `./db/tables`;

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
        console.log('############## Creating Tables ##############');
        response = await createDB();
        console.log(`Created DB`);

        fs.readdirSync(tablesFolder).forEach((file) => {
            const names = file.split(".");
            if(names){
                const name = names[0];
                require(`./tables/${name}`).createTable(con).then(() => {
                    console.log(`Created Table: ${file}`);
                }).catch(err => console.log(err.message));
            }
        });
        console.log('\n############## Running Migrations ##############');
        console.log('If ERR => ER_DUP_FIELDNAME then it is already in the DB.')
        fs.readdirSync(migrationFolder).forEach((file) => {
            const names = file.split(".");
            if(names){
                const name = names[0];
                require(`./migrations/${name}`)(con).then(() => {console.log(`Migrated File: ${file}`);}).catch(err => console.log(err.message));
            }
        });
    }
    catch(err){
        console.log(err);
    }

    con.end();
});
