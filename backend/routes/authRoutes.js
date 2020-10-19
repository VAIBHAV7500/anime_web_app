var express = require('express');
var router = express.Router();
var db = require('../db/index');

module.exports = (app)=>{
    
    router.post('/register',async (req, res, next) => {
        const resp = await db.user.create(req.body).catch(err=>{
            errMessage = err.sqlMessage;
            if(errMessage.includes("email")){
                res.json({message : "Email Already Taken"});
            }
            else if(errMessage.includes("mobile")){
                res.json({message : "Mobile No. Already Taken"});
            }
            else{
                res.json({message : "Registration Failed"});
            }
            return;
        }); 
        if(resp){
            res.json({message : "Registration Successfull"});
        }
    });
    
    router.post('/login',app.oauth.grant());
    
    return router;
};
