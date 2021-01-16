const {expirePlans} = require('../../lib/order');
const {cleanVerificationTable} = require('../../lib/verification');
module.exports = [
  {
    cronTime: '30 12 * * *', // Everyday at 12:30
    onTick: () => {
      expirePlans(); // Expire Plans
    }
  },{
    cronTime: '0 1 * * *', // Everyday at 1
    onTick: () => {
      cleanVerificationTable(); // Clean Verification Table
    }
  }
];
