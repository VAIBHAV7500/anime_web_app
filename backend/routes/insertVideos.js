var express = require('express');
var router = express.Router();
var db = require('../db/index');

router.post('/', async (req, res, next)=>{
    req.body = JSON.parse(JSON.stringify(req.body));
    const result = await db.videos.findByEpisodeName(req.body.name,req.body.show_id).catch(e=>{
        console.log(e);
        res.json({
            message : e
        });
    });
    if(result){
        res.json({
            message : "already added episode " + req.body.episode_number
        })
    }else{
        await db.videos.create(req.body).catch(e=>{
            console.log(e);
            res.json({
                message : e
            });
        });
        res.json({
            message : "added episode " + req.body.episode_number,
        })
    }
});

module.exports = router;