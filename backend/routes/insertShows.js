var express = require('express');
var router = express.Router();
var db = require('../db/index');

router.post('/', async (req, res, next)=>{
    req.body = JSON.parse(JSON.stringify(req.body));
    const result = await db.shows.findByOriginalName(req.body.original_name).catch(e=>{
        console.log(e);
        res.json({
            message : e
        });
    });
    if(result){
        res.json({
            show_id : result.id,
            message : req.body.name+" (Season) already added"
        });
    }else{
        const new_id = await db.shows.addShows(req.body).catch(e=>{
            console.log(e);
            res.json({
                message : e
            });
        });
        res.json({
            show_id : new_id.id,
            message : req.body.name+" (Season) added"
        });
    }
});

module.exports = router;