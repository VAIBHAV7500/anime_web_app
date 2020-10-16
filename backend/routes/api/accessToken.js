const express = require('express');
const router = express.Router();
var db = require('../../db/index');

router.post('/getId', async (req,res,next)=>{
    const response = await db.access_tokens.findAccessToken(req.body.token);
    if(response){
        res.json({
            id : response.user_id
        });
    }else{
        res.json({
            id : null,
            message : "No Access Token exist"
        });
    }
})


module.exports = router;
