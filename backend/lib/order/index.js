const db = require('../../db');
const { getLogger } = require('../logger');
const logger = getLogger('order');
const redis = require('../redis');
const moment = require('moment'); // require
const format = 'YYYY-MM-DD';
const {
  redis: {
      USER_PLAN_KEY
  }
} = require('../../services/constant');
const plans = require('../../config/plans');

const updateUserDates = async (duration, user_id,plan_id) => {
  let result = [];
  const isPremium = isPaid(user_id,plan_id);
  if(isPremium){
    result = await db.user.getExpiryDate(user_id).catch((err)=>{
      logger.error(`User Id: ${user_id} | error: ${err.message} | stack: ${err.stack}`);
    });
  }
  let expiryDate;
  if(result && result.length){
    expiryDate = result[0].expiry_date;
  }
  let newDate;
  if(expiryDate){
    newDate = moment(expiryDate).utc().add(duration + 1, 'days').format(format);
  }else{
    newDate = moment().add(duration + 1, 'days').format(format);
  }
  await db.user.updatePlan(newDate,plan_id,[user_id]).catch((err) => {
    logger.error(err);
  })
  logger.info(`User Id: ${user_id} | Plan Id: ${plan_id} | Succesful`);
}

const planDowngrade = async (userIds) => {
  await db.user.updatePlan('NULL', 1, userIds);
}

const expirePlans = async () => {
  const currDate = moment().format(format);
  const results = await db.user.expirePlans(currDate);
}

const getPlan = async (user_id) => {
  if(user_id){
    const key = USER_PLAN_KEY + user_id;
    const redisResult = await redis.getValue(key);
    if(redisResult){
      return redisResult;
    }else{
      const plan_id = await db.user.getPlan(user_id);
      redis.setValue(key,plan_id);
      return plan_id;
    }
  }
}

const isPaid = async (user_id, plan_id_arg = null) => {
  let plan_id = 1;
  if(plan_id_arg){
    plan_id = plan_id_arg;
  }else{
    plan_id = await getPlan(user_id);
  }
  return plans.paid_plan_ids.some(x => x.id === plan_id);
}

module.exports = {
  updateUserDates,
  planDowngrade,
  expirePlans,
  getPlan,
  isPaid
}
