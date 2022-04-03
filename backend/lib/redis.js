const setValue = (key,value) => {
  if(global.redis){
    global.redis.setex(key, 3600, JSON.stringify(value));
  }
}

const getValue = async (key) => {
  if(global.redis){
    const result = await new Promise((res,rej)=>{
      try{
        global.redis.get(key, async (err, redisResult) => {
          if(err){
            rej(err);
          }else{
            res(redisResult);
          }
        });
      }catch(e){
        rej(e);
      }
    });
    if(result){
      return JSON.parse(result);
    }
  }
  return null;
}

module.exports = {
  getValue,
  setValue,
}