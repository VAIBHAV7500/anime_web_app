var express = require('express');
const db = require('../db');
var router = express.Router();
const redis = require('../lib/redis');

const checkIp = async (ip,userId) => {
    const ipObj = {
        ip: ip,
        user_id: userId,
    };
    const res = await db.user_ip.findByUserId(userId).catch((err) => {
        throw new Error({
            message : err,
            stack : err.stack,
            status : 404,
        });
    });
    if(res){
        let ipArray = JSON.parse(JSON.stringify(res));
        let result = ipArray.find(obj => obj.ip === ip);
        if(result) return true; 
        if(res.length >= 4/*user screeen limit get from Table based on current userID */){
            await db.user_ip.deleteIp(ipArray[0].ip,userId).catch(err=>{
                throw new Error({
                    message : err,
                    stack : err.stack,
                    status : 500,
                });
            });
        }
    }
    await db.user_ip.create(ipObj).catch((err) => {
        throw new Error({
            message : err,
            stack : err.stack,
            status : 500,
        });
    });
    return true;
}

module.exports = (app)=>{
    router.post('/enter',app.oauth.authorise(),async (req,res)=>{
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const user_id = req.oauth.bearerToken.user.id;
        if(user_id){
            const response = await checkIp(ip,user_id).catch((err)=>{
                res.status(err.status).json({
                  message : err.message,
                  stack : err.stack,
                });
              });
              if(response){
                  const plan_id = await db.user.getPlan(user_id);
                  const key = `user_plan_${user_id}`;
                  redis.setValue(key,plan_id);
                  res.status(200).json({
                      message : "Successfully Entered",
                      user_id,
                      plan_id,
                  });
              }
        }else{
            res.status(403);
        }
    });
    return router;
}
