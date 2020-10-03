var db = require('../db/index');

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
    result = await db.user.find_by_email(email).catch(e=>{callback(null,null); return;});
    callback(null,result ? result.password == password ? result : null :null);
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
    const accessToken = {
        user: {
        id: result.user_id,
        },
        expires: null,
    }
    callback(result.user_id == null ? true : false, result.user_id == null ? null : accessToken);
}

module.exports = {
    getClient: getClient,
    saveAccessToken: saveAccessToken,
    getUser: getUser,
    grantTypeAllowed: grantTypeAllowed,
    getAccessToken: getAccessToken,
}

