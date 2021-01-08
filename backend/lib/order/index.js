const db = require('../../db');
const { getLogger } = require('../logger');
const logger = getLogger('order');
const moment = require('moment'); // require
const format = 'YYYY-MM-DD';

const updateUserDates = async (duration, user_id,plan_id) => {
  const result = await db.user.getExpiryDate(user_id).catch((err)=>{
    logger.error(`User Id: ${user_id} | error: ${err.message} | stack: ${err.stack}`);
  });
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

module.exports = {
  updateUserDates,
  planDowngrade,
  expirePlans,
}
