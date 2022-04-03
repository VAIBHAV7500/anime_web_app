const express = require('express');
const router = express.Router();
const db = require('../db/index');
const {geoBlockCheckMiddleware, userSchemaCheck} = require('../services/middleware');
const {createHash} = require('../services/bcrypt');
const {verifyUser,initiateUserVerification, resendOTP} = require('../lib/verification');
const {logger} = require('../lib/logger');

module.exports = (app)=>{
    
    router.post('/register', userSchemaCheck , async (req, res, next) => {
        try{
            let body = req.body;
            const password = body.password;
            const email = body.email;
            const existingInactiveUser = await db.user.find_by_email(email,false);
            if(existingInactiveUser){
                await db.user.destroyInactiveUser(existingInactiveUser.id);
            }
            const hash = await createHash(password);
            body.password = hash;
            body.is_active = true;
            body.plan_id = 2;
            const resp = await db.user.create(body).catch(err=>{
                errMessage = err.sqlMessage;
                if(errMessage.includes("email")){
                    res.status(409).json({
                        message : "Email Already Taken",
                    });
                }
                else if(errMessage.includes("mobile")){
                    res.status(409).json({
                        message : "Mobile No. Already Taken",
                    });
                }
                else{
                    res.status(403).json({
                        message : "Registration Failed",
                    });
                }
                return;
            }); 
            if(resp){
                const user_id = resp.insertId;
                // await initiateUserVerification(user_id).catch((err) => {
                //     res.status(403).json({
                //         message : "Verification Initiation Failed",
                //     });
                // });
                res.status(200).json({
                    id: user_id
                });
            }

        }catch(err){
            logger.error(err);
            res.status(501).send();
        }
    });
    
    router.post('/login', geoBlockCheckMiddleware, app.oauth.grant(),(req,res,next)=>{
    });

    router.get('/verify/:user/:otp', async (req,res,next) => {
        const user_id = req.params.user;
        const otp = req.params.otp;
        try{
            const result = await verifyUser(user_id,otp);
            if(result){
                const updateResult = await db.user.makeUserActive(user_id);
                if(updateResult){
                    res.status(200).json({
                        message: "Verification Successful"
                    });
                }
            }else{
                res.status(401).json({
                    message: "False Verification"
                });
            }

        }catch(err){
            logger.error(err);
            res.status(501).send();
        }
    });

    router.get('/verification-resend/:user', async (req,res,next) => {
        try{
            const user_id = req.params.user;
            await resendOTP(user_id);
            res.status(200).send();
        }catch(err){
            logger.error(err);
            res.status(501).send();
        }
    });
    
    return router;
};
