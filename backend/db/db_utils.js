const {getLogger} = require('../lib/logger');
const logger = getLogger('sql');

const runQuery = (sql,params= [], retry = 0) =>{
    if(process.env.ENV === 'dev'){
        logger.info(sql);
    }
    return new Promise((res,rej)=>{
        if(global.connection.state === 'disconnected'){
            try{
                //global.connection = getConnection();
            }catch(e){
                logger.error(e.message);
            }
        }
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
