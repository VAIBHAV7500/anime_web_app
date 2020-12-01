var express = require('express');
var router = express.Router();
var db = require('../../db/index');

router.post('/insert-genre/:genre', async (req, res, next)=>{
    const result = await db.genre.findByGenre(req.params.genre).catch(e=>{
        res.json({
            message : e
        });
    });
    if(result){
        res.json({
            genre_id : result.id,
            message : req.params.genre + " already added"
        });
    }else{
        const new_id = await db.genre.create({category : req.params.genre}).catch(e=>{
            res.json({
                message : e
            });
        });
        res.json({
            genre_id : new_id.id,
            message : req.params.genre + " added"
        });
    }
});

module.exports = router;

