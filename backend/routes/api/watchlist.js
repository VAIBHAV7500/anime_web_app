const express = require('express');
const router = express.Router();
const db = require('../../db/index');

router.post('/add-to-watchlist', async (req,res) => {
    console.log(req.body);
    await db.watchlist.create(req.body).catch(err => {
        res.status(err.status).json({
            message : err.message,
            stack : err.stack,
        });
    })
    res.status(200).json({
        message:"successfully added",
    });
});

router.post('/watchlist', async (req,res) => {
    const result = await db.watchlist.getAllShowIdByUserId(req.body.user_id).catch(err => {
        res.status(err.status).json({
            message : err.message,
            stack : err.stack,
        });
    });
    res.status(200).json({
        result : result,
    });
});

router.post('/add-to-currently-watching', async (req,res) => {
    await db.currently_watching.create(req.body).catch(err => {
        res.status(err.status).json({
            message : err.message,
            stack : err.stack,
        });
    })
    res.status(200).json({
        message:"successfully added",
    });
});

router.post('/currently-watching', async (req,res) => {
    const result = await db.currently_watching.getAllShowIdByUserId(req.body.user_id).catch(err => {
        res.status(err.status).json({
            message : err.message,
            stack : err.stack,
        });
    });
    res.status(200).json({
        result : result,
    });
});

router.post('/add-to-completed', async (req,res) => {
    await db.completed_shows.create(req.body).catch(err => {
        res.status(err.status).json({
            message : err.message,
            stack : err.stack,
        });
    })
    res.status(200).json({
        message:"successfully added",
    });
});

router.post('/completed', async (req,res) => {
    const result = await db.completed_shows.getAllShowIdByUserId(req.body.user_id).catch(err => {
        res.status(err.status).json({
            message : err.message,
            stack : err.stack,
        });
    });
    res.status(200).json({
        result : result,
    });
});


module.exports = router;
