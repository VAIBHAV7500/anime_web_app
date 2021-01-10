const {getLogger} = require('../lib/logger');
const logger = getLogger('sql');
const MAX_RETRY = 3;

const runQuery = async (sql,params= [], retry = 0) =>{
    if(process.env.ENV === 'dev'){
        logger.info(sql);
    }
    let results = await new Promise((res,rej)=>{
        global.connection.query(sql,params,(error, result)=>{
            if(error){
                rej(error);
            }
            res(result);
        });
    }).catch((err) => {
        logger.error(err);
        if(retry >= MAX_RETRY){
            throw err;
        }
    });
    if(results === undefined){
       if(retry < MAX_RETRY){
         console.log(`Retrying...` + sql);
         results = await runQuery(sql,params,retry + 1);
       }
    }
    return results;
}

module.exports = {
    runQuery
}
