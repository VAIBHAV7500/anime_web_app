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
    const user_id = req.query.user_id;
    const response = await db.reviews.findByShows(show_id,user_id).catch((err)=>{
        res.status(502).json({
            error: err.message,
            stack: err.stack
        });
    });
    const review_ids = response.map((x) => x.id);
    const body = [];
    if(review_ids.length){
        let likes = await db.user_review.findReviewByUser(review_ids,user_id);
        likes = likes.map(x => x.review_id);
        response.forEach((review)=>{
            body.push(Object.assign(review, {
                current_user: (likes.indexOf(review.id) !== -1 ? true : false)
            }));
        })
    }
    res.json(body);
});

router.post('/like', async (req, res, next) => {
    const body = req.body;
    if(body){
        const review_id = body.review_id;
        const promiseArray = [];
        promiseArray.push(new Promise((res,rej)=>{
            db.reviews.likeAction(review_id, 1).then(result => res(result)).catch(err => rej(err));
        }));
        promiseArray.push(new Promise((res,rej)=>{
            db.user_review.create(body).then(result => res(result)).catch(err => rej(err));
        }));
        await Promise.all(promiseArray).catch((err)=>{
            res.status(501).json({
                error: err.message,
                stack: err.stack
            })
        });
        res.json({
            success: true
        });
        
    }else{
        res.status(401).json({
            message: "No Body Found"
        });
    }
});

router.delete('/unlike', async (req, res, next) => {
    const id = req.query.id;
    const user_id = req.query.user_id;
    if (id && user_id) {
        const promiseArray = [];
        promiseArray.push(new Promise((res, rej) => {
            db.reviews.likeAction(id, -1).then(result => res(result)).catch(err => rej(err));
        }));
        promiseArray.push(new Promise((res, rej) => {
            db.user_review.deleteRecord(id, user_id).then(result => res(result)).catch(err => rej(err));
        }));
        await Promise.all(promiseArray).catch((err) => {
            res.status(501).json({
                error: err.message,
                stack: err.stack
            })
        });

        res.json({
            success: true
        });

    } else {
        res.status(401).json({
            message: "No Body Found"
        });
    }
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

router.get('/my-reviews', async (req,res,next)=>{
    const id = req.query.id;
    const reviews = await db.reviews.findByUserId(id).catch((err)=> {
        console.log(err);
        res.status(500).json({
            error: err.message,
            stack: err.stack,
        });
    });
    if(reviews){
        res.json(reviews);
    };
});

module.exports = router;
