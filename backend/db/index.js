const mysql = require('mysql2');
const fs = require('fs');
const util = require('util');
const {getLogger} = require('../lib/logger');
const logger = getLogger('sql');

const tablesFolder = `./db/tables`;

const useDB = (con) =>{
    con.query(`USE ${process.env.DB}`);
}



const getConnection = () =>{
      const pool = mysql.createPool({
        connectionLimit: 3,
        connectTimeout  : 60 * 60 * 1000,
        acquireTimeout  : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
      })
      
      // Ping database to check for common exception errors.
      pool.getConnection((err, connection) => {
        if (err) {
          if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            logger.error('Database connection was closed.');
            global.pool = getConnection();
          }
          if (err.code === 'ER_CON_COUNT_ERROR') {
            logger.error('Database has too many connections.')
          }
          if (err.code === 'ECONNREFUSED') {
            logger.error('Database connection was refused.')
          }
        }
      
        if (connection) connection.release()
      
        return
      })
      
      // Promisify for Node.js async/await.
      pool.query = util.promisify(pool.query);

    return pool;
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