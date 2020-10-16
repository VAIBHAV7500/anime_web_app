const express = require('express');
const router = express.Router();
var db = require('../../db/index');

router.post('/getId', async (req,res,next)=>{
    if(req.body.token){
        const response = await db.access_tokens.findAccessToken(req.body.token).catch((err)=>{
            res.status(401).json({
                error: err.message,
                stack: err.stack
            });
        });
        if(response){
            res.json({
                id : response.user_id
            });
        }else{
            res.status(404).json({
                id : null,
                message : "No Access Token exist"
            });
        }
    }else{
        res.status(404).json({
            id : null,
            message : "No Access Token exist"
        });
    }
    
});


module.exports = router;
