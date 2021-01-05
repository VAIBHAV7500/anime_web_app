const express = require('express');
const router = express.Router();
const db = require('../../db/index');
const redis = require('../../lib/redis');

router.get('/', async (req,res,next)=>{
    const show_id = req.query.show_id;
    if(show_id){
        const key = `character_${show_id}`;
        const redisResult = await redis.getValue(key);
        if(redisResult){
            res.json(redisResult);
        }else{
            const result = await db.characters.getCharactersByShows(show_id).catch((err)=>{
                res.status(401).json({
                    err: err.message,
                    stack: err.stack
                });
            });
            if(result){
                redis.setValue(key,result);
                res.json(result);
            }
        }
    }else{
        res.status(401);
    }
});

router.post('/create', async (req,res,next)=>{
    const body = req.body;
    const characterBody = {
        name: body.name,
        description: body.description,
        role: body.role,
        image_url: body.image_url,
    }
    const record = await db.characters.create(characterBody).catch((err)=>{
        res.status(501).json({
            error: err.message,
            stack: err.stack,
        });
        return;
    })
    const id = record.insertId;
    const mappingBody = {
        show_id: body.show_id,
        character_id: id
    }
    const mappingResponse = await db.character_show_mapping.create(mappingBody).catch((err)=>{
        res.status(501).json({
            error: err.message,
            stack: err.stack,
        })
        return;
    });
    res.json({
        character_id: id,
        mapping_id: mappingResponse.insertId,
    });
});

module.exports = router;
