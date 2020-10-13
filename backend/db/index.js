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
const access_tokens = require('./tables/access_tokens');
const group = require('./tables/group');
const genre_show_mapping = require('./tables/genre_show_mapping');
const characters = require('./tables/characters');
const character_show_mapping = require('./tables/character_show_mapping');

const useDB = (con) =>{
    con.query(`USE ${dbConfig.db_name}`);
}

const getConnection = () =>{
    const con = mysql.createConnection({
        host: dbConfig.db_url,
        user: dbConfig.user,
        password: dbConfig.password
    });
    useDB(con);
    return con;
}

module.exports =  {
    user,
    sessions,
    plans,
    genre,
    shows,
    videos,
    audios,
    subtitles,
    getConnection,
    access_tokens,
    group,
    genre_show_mapping,
    characters,
    character_show_mapping
}
