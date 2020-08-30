const runQuery = (sql,params= []) =>{
    return new Promise((res,rej)=>{
        global.connection.query(sql,params,(error, result)=>{
            if(error){
                console.log(error);
                rej(error);
            }
            res(result);
        });
    });
}

module.exports = {
    runQuery
}
