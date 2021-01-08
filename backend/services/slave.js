const cron = require('./cron');

const executeOnce = () => {
  cron.loadCron();
}

module.exports = {
  executeOnce
}
