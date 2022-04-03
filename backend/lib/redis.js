const setValue = (key,value) => {
  if(process.env.NODE_ENV === "production"){
    return null;
  }
  global.redis.setex(key, 3600, JSON.stringify(value));
}

const getValue = async (key) => {
  if(process.env.NODE_ENV === "production"){
    return null;
  }
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
  }else{
    return null;
  }
}

module.exports = {
  getValue,
  setValue,
}