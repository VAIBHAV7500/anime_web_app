const CronJob = require('cron').CronJob;
const {getLogger} = require('../../lib/logger');
const logger = getLogger('cron');
const jobs = require('./jobs');

const addNewJob = (body) => {
  if(body.cronTime === null || body.onTick  === null){
    return new Error("No Proper Arguments");
  }
  const cronTime = body.cronTime;
  const onComplete = () => {
    logger.info('Succesfully Ran Cron ');
  };
  const onTick = () => {
    try{
      const args = body.params || [];
      body.onTick(...args);
    }catch(err){
      logger.error(err);
    }
  };
  const timeZone = body.timeZone || 'Asia/Kolkata';
  const job = new CronJob(cronTime,onTick,onComplete,null,timeZone);
  job.start();
}

const loadCron = () => {
  console.log('Loading Cron...');
  jobs.forEach((job) => {
    addNewJob(job);
  })
}

module.exports = {
  loadCron
}
