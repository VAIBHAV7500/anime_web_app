const mysql = require('mysql');
const dbConfig = require('../config/dbConfig.json');
const fs = require('fs');

const tablesFolder = `./db/tables`;

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

    con.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            global.connection = mysql.createConnection({
                host: dbConfig.db_url,
                user: dbConfig.user,
                password: dbConfig.password
            });                       // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });

    return con;
}

let exportJson = {
    getConnection,
}

fs.readdirSync(tablesFolder).forEach((file) => {
    const names = file.split(".");
    if(names){
        const name = names[0];
        exportJson[name] = require(`./tables/${name}`);
    }
});

module.exports = exportJson