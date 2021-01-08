const {expirePlans} = require('../../lib/order');
module.exports = [
  {
    cronTime: '30 12 * * *', // Everyday at 12:30
    onTick: () => {
      expirePlans(); // Expire Plans
    }
  }
];
