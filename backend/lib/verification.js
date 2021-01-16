const {sendMail,generateMailBody} = require('../lib/mailer');
const {compileTemplate} = require('../lib/handlebars');
const db = require('../db');
const {logger} = require('./logger');
const moment = require('moment');
const format = 'YYYY-DD-MM';

const generateOTP = () => {
    const digits = '0123456789';
    const otpLength = 6;
    let otp = '';

    for(let i=1; i<=otpLength; i++){
        const index = Math.floor(Math.random()*(digits.length));
        otp = otp + digits[index];
    }
    return otp;
}

const sendOTP = async (otp, user_id) => {
  const htmlTemplate = await generateMailBody('verification');
  const link = process.env.BASE_URL + `auth/verify/${user_id}/${otp}`;
  const params = {
    otp: otp || generateOTP(),
    link
  }
  const html = compileTemplate(htmlTemplate,{params});
  const user = await db.user.find(user_id);
  if(user){
    const email = user.email;
    console.log(email);
  }
  console.log(html);
  const mail = {
    to: ['vbhvsolanki7500@gmail.com'],
    subject: 'Your OTP by Animei TV',
    html,
  }
  sendMail(mail);
}

const initiateUserVerification = async (user_id) => {
  const otp = generateOTP();
  const body = {
    verification_token: otp,
    user_id,
  }
  const result = await db.user_verification.create(body).catch((err) => {
      logger.error(err);
  });
  if(result){
    sendOTP(otp,user_id);
  }
}

const verifyUser = async (user_id,otp) => {
  const result = await db.user_verification.find(user_id);
  if(result && result.length){
    if(result[0].verification_token === otp){
      return true;    
    }
  }
  return false;
}

const resendOTP = async (user_id) => {
  const result = await db.user_verification.find(user_id);
  if(result && result.length){
    const otp = result[0].verification_token;
    sendOTP(otp,user_id);
  }
}

const cleanVerificationTable = async () => {
  try{
    const buffer = 2; //days
    const baseTime = moment().utc().subtract(buffer,'days');
    const fromDate = baseTime.format(format);
    await db.user_verification.destroyByDate(fromDate);
  }catch(err){
    logger.error(err);
  }
}

module.exports = {
  generateOTP,
  sendOTP,
  verifyUser,
  initiateUserVerification,
  resendOTP,
  cleanVerificationTable,
}