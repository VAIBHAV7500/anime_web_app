const {getLogger} = require('../lib/logger');
const logger = getLogger('sql');
const runQuery = (sql,params= []) =>{
    if(process.env.ENV === 'dev'){
        logger.info(sql);
    }
    return new Promise((res,rej)=>{
        global.connection.query(sql,params,(error, result)=>{
            if(error){
                rej(error);
            }
            res(result);
        });
    });
}

module.exports = {
    runQuery
}
