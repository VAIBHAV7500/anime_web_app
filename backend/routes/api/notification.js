const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.get('/unread',async (req,res,next)=>{
  const userId = req.query.user_id;
  if(userId){
    const result = await db.notification_engagements.getAll(userId).catch((err)=>{
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

router.patch('/mark-read', async (req,res,next)=>{
  const body = req.body;
  if(body && body.user_id){
    const id = body.user_id;
    const result = db.notification_engagements.markRead(id).catch((err)=>{
      res.status(501).json({
        error: err.message
      });
    });
    if(result){
      res.status(200).json({
        success: true
      });
    }
  }else{
    res.status(401).json({
      success: false
    })
  }
});

module.exports = router;
