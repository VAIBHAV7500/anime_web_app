var db = require('../db/index');
const passport = require('passport');
const {compareHash} = require('../services/bcrypt');
//const {sendMessage} = require('./pushNotification');

const getClient = async (clientID, clientSecret, callback) => {
  const client = {
    clientID,
    clientSecret,
    grants: null,
    redirectUris: null,
  }
  callback(false, client);
}

const grantTypeAllowed = async (clientID, grantType, callback) => {
    callback(false, true);
}

const getUser = async (email, password, callback) => {
    result = await db.user.find_by_email(email).catch(e=>{
        console.log('Error re error')
        console.log(e.backtrace);
        callback(null,null); 
        return;
    });
    console.log(result);
    if(result){
        const comparePass = await compareHash(result.password, password);
        if(!comparePass){
            result = null;
        }else{
            if(process.env.NODE_ENV === 'production'){
                //sendMessage(`${email} just log in`);
            }
        }
    }
    callback(null,result);
}

const createPassportSession = (result) => {
    console.log('Login Sucessfull');
    console.log(result);
    return result;
}

const saveAccessToken = async (accessToken, clientID, expires, user, callback) => {
    userObject = {
        access_token : accessToken,
        user_id : user.id,
    };
    results = await db.access_tokens.create(userObject).catch((e)=>{
        callback(e);return;
    })
    callback(null);
}

const getAccessToken = async (bearerToken, callback) => {
    result = await db.access_tokens.findAccessToken(bearerToken).catch(e=>{callback(true,null);return;});
    if(result){
        const accessToken = {
            user: {
                id: result.user_id,
            },
            expires: null,
        }
        callback(result.user_id == null ? true : false, result.user_id == null ? null : accessToken);
    }else{
        callback(true,null);
    }
}

module.exports = {
    getClient: getClient,
    saveAccessToken: saveAccessToken,
    getUser: getUser,
    grantTypeAllowed: grantTypeAllowed,
    getAccessToken: getAccessToken,
}

