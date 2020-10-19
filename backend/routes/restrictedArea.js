var express = require('express');
const db = require('../db');
var router = express.Router();

const checkIp = async (ip,userId) => {
    const ipObj = {
        ip: ip,
        user_id: userId,
    };
    const res = await db.user_ip.findByUserId(userId).catch((err) => {
        throw err;
    });
    if(res){
        let ipArray = JSON.parse(JSON.stringify(res));
        let result = ipArray.find(obj => obj.ip === ip);
        if(result){
            console.log("This ip is already registered");
            return ;
        }    
        if(res.length >= 4/*user screeen limit get from Table based on current userID */){
            console.log(`Screen Limit full now removing the last accessed IP i.e ${ipArray[0].ip} of user ID : ${userId}`);
            await db.user_ip.deleteIp(ipArray[0].ip,userId).catch(err=>{
                throw err;
            });
        }
    }
    console.log("new ip created " + ip);
    await db.user_ip.create(ipObj).catch((err) => {
        throw err;
    });
}

module.exports = (app)=>{
    router.post('/enter',app.oauth.authorise(),async (req,res)=>{
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await checkIp(ip,req.oauth.bearerToken.user.id).catch((err)=>{
          res.json({
            message : err.message,
            stack : err.stack,
          });
        });
        res.json({
          message : "Successfully Entered",
          user_id : req.oauth.bearerToken.user.id,
        });
    });
    return router;
}
