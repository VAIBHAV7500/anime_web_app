var express = require('express');
var router = express.Router();
var db = require('../db/index');
const {geoBlockCheckMiddleware} = require('../services/middleware');

module.exports = (app)=>{
    
    router.post('/register',geoBlockCheckMiddleware, async (req, res, next) => {
        res.status(200).json({
            message : "Registration Successfull"
        });
        //Disabling Signup
        //let body = req.body;
        // const resp = await db.user.create(body).catch(err=>{
        //     errMessage = err.sqlMessage;
        //     if(errMessage.includes("email")){
        //         res.status(409).json({
        //             message : "Email Already Taken",
        //             stack : err.stack,
        //         });
        //     }
        //     else if(errMessage.includes("mobile")){
        //         res.status(409).json({
        //             message : "Mobile No. Already Taken",
        //             stack : err.stack,
        //         });
        //     }
        //     else{
        //         res.status(403).json({
        //             message : "Registration Failed",
        //             stack : err.stack,
        //         });
        //     }
        //     return;
        // }); 
        // if(resp){
        //     res.status(200).json({
        //         message : "Registration Successfull"
        //     });
        // }
    });
    
    router.post('/login', geoBlockCheckMiddleware, app.oauth.grant(),(req,res,next)=>{
    });
    
    return router;
};
