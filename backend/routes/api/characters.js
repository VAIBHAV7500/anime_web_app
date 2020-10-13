const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.get('/', async (req,res,next)=>{
    const show_id = req.query.show_id;
    const result = await db.characters.getCharactersByShows(show_id).catch((err)=>{
        res.status(401).json({
            err: err.message,
            stack: err.stack
        });
    })
    if(result){
        res.json(result);
    }
});

module.exports = router;
