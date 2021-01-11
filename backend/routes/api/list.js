const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/add-watchlist', async (req,res) => {
    const body = req.body;
    if(!body.user_id || !body.show_id){
        res.status(401).json({
            message: "User Id or Show Id is not present!!"
        });
    }else{
        await db.watchlist.create(body).catch(err => {
            res.status(501).json({ 
                message : "Duplicate Entry",
                stack : err.stack,
            });
        });
        res.status(200).json({ 
            message:"successfully added",
        });
    }
});

router.get('/watchlist', async (req,res) => {
  const user_id = req.query.id;
  if(user_id){
    const result = await db.watchlist.getAllShowIdByUserId(user_id).catch(err => {
      res.status(501).json({
          message : err.message,
          stack : err.stack,
      });
    });
    res.status(200).json({
      result : result,
    });
  }else{
    res.status(401).json({
      message: "No proper user id"
    });
  }
});

router.delete('/remove-watchlist', async (req,res)=>{
  const userId = req.query.user_id;
  const showId = req.query.show_id;
  if(!userId || !showId){
    res.status(401).json({
      message: "User id or Show id is missing"
    })
  }else{
    const response = await db.watchlist.deleteRecord(showId,userId).catch((err)=>{
      res.status(501).json({
        err: err.message,
        stack: err.stack
      })
    });
    res.json({
      message: "ok"
    });
  }
});

router.post('/add-currently-watching', async (req,res) => {
  const body = req.body;
  if(!body.user_id || !body.show_id){
    res.status(401).json({
        message: "User Id or Show Id is not present!!"
    });
  }else{
    await db.currently_watching.create(body).catch(err => {
      res.status(501).json({
          message : err.message,
          stack : err.stack,
      });
    })
    res.status(200).json({
        message:"successfully added",
    });
  }
});

router.get('/currently-watching', async (req,res) => {
    const user_id = req.query.id;
    if(user_id){
      const result = await db.user_player_session.findByUserId(user_id).catch(err => {
        res.status(500).json({
            message : err.message,
            stack : err.stack,
        });
      });
      if(result){
        res.status(200).json({
          result : result
        });
      }
    }else{
      res.status(401).json({
        message: "No proper user id"
      });
    }
});

router.post('/add-completed', async (req,res) => {
    const body = req.body;
    if(!body.user_id || !body.show_id){
      res.status(401).json({
          message: "User Id or Show Id is not present!!"
      });
    }else{
      await db.completed_shows.create(body).catch(err => {
          res.status(501).json({
              message : err.message,
              stack : err.stack,
          });
      })
      res.status(200).json({
          message:"successfully added",
      });
    }
});

router.get('/completed', async (req,res) => {
    const user_id = req.query.id;
    if(user_id){
      const result = await db.user_player_session.completedShows(user_id).catch(err => {
        res.status(501).json({
            message : err.message,
            stack : err.stack,
        });
      });
      res.status(200).json({
          result : result,
      });
    }else{
      res.status(401).json({
        message: "No proper user id"
      });
    }
});


module.exports = router;
