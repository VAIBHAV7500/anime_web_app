const bcrypt = require ('bcrypt');
const {logger} = require('../lib/logger');
const {
  bcrypt:{
    SALT_ROUNDS
  }
} = require('./constant');

const createHash = async (value) => {
  const result = await new Promise((res,rej) => {
    bcrypt.hash(value, SALT_ROUNDS, function(err, hash) {
      if(err){
        rej(err);
      }else{
        console.log(hash);
        res(hash);
      }
    });
  }).catch((err) => {
    logger.error(err);
  });
  return result;
}

const compareHash = async (hash, value) => {
  const result = await new Promise((res,rej) => {
    bcrypt.compare(value, hash, function(err, result) {
      if(err){
        rej(err);
      }
      else if (result) {
        console.log(result);
        res(true);
      }
      else {
        res(false);
      }
    });
  }).catch((err) => {
    logger.error(err);
    return false;
  });
  return result;
}

module.exports = {
  createHash,
  compareHash,
}