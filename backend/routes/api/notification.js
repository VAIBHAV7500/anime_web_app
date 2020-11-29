const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.get('/unread',async (req,res,next)=>{
  const userId = req.query.user_id;
  console.log(userId);
  console.log('In notification');
  if(userId){
    const result = await db.notification_engagements.findUnread(userId).catch((err)=>{
      res.status(501).json({
        error: err.message,
        stack: err.stack
      });
    })
    if(result){
      res.json(result);
    }
  }else{
    res.status(401).json({
      message: "no user id"
    });
  }
});

module.exports = router;
