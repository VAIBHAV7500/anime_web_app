const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.get('/', async (req, res, next) => {
    const id = req.query.id;
    const result = await db.reviews.find(id).catch((err) => {
        res.status(401).json({
            err: err.message,
            stack: err.stack
        });
    })
    if (result) {
        res.json(result);
    }
});

router.get('/shows', async (req, res, next)=>{
    const show_id = req.query.id;
    const response = await db.reviews.findByShows(show_id).catch((err)=>{
        res.status(502),json({
            error: err.message,
            stack: err.stack
        });
    });
    res.json(response);
});

router.post('/create', async (req, res, next) => {
    const body = req.body;
    console.log(body);
    body.likes = 0;
    body.approved = true;
    if(body){
        const response = await db.reviews.create(body).catch((err)=>{
            res.status(501).json({
                error: err.message,
                stack: err.stack
            });
        });
        const id = response.insertId;
        res.json({
            id
        });
    }else{
        res.status(402).json({
            message: "Body is not defined"
        })
    }
});

module.exports = router;
