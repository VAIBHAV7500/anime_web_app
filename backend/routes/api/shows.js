var express = require('express');
var router = express.Router();
const keys = require('../../config/keys.json');
const formidable = require("formidable");
const db = require('../../db/index');
const {search} = require('../../lib/search');

router.post('/create',async (req,res,next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = process.env.UPLOAD_DIR;
    form.parse(req,(err,fields)=>{
        if(err){throw err};
        if(fields.api_key && fields.api_key === keys.app.apiKey){
            delete fields["api_key"];
            db.shows.create(fields).then((result)=>{
                res.json(result);
            }).catch((err)=>{
                res.status(500).json({
                    success: false,
                    message: err.message,
                    stack: err.stack
                });
            });
            
        }
        else{
            res.status(401).json({
                message: "API key is wrong or not there"
            });
        }
    });
});

router.get('/details',async (req,res,next)=>{
    const id = req.query.id;
    const userId = req.query.user_id;
    if(!id || !userId){
        res.status(401).json({
            error: "No Id found",
        });
        return;
    }
    let key = `show_${id}`;
    global.redis.get(key, async (err, redisResult) => {
        let data;
        if(err){
            res.status(501).json({
                message: "Something went wrong"
            })
        }
        else if(redisResult){
            data = JSON.parse(redisResult);
        }else{
            data = await db.shows.find(id, true);
            global.redis.setex(key, 3600, JSON.stringify(data));
        }
        if(!data){
            res.status(404).json({
                error: "Show Id not found",
            });
            return;
        }
        const promiseArray = [];
        promiseArray.push(new Promise((res,rej)=>{
            db.genre.bulkFindCategory(id).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            });
        }));

        promiseArray.push(new Promise((res, rej) => {
            db.shows.getShowsByGroupId(data.group_id).then((result) => {
                res(result);
            }).catch((err) => {
                rej(err);
            });
        }));

        promiseArray.push(new Promise((res,rej)=>{
            db.watchlist.exists(id,userId).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            }); 
        }));

        promiseArray.push(new Promise((res,rej)=>{
            db.videos.fetchRecent(id, userId).then((result)=>{
                if(result.length){
                    res(result[0]);
                }else{
                    res(null);
                }
            }).catch((err)=>{
                rej(err);
            })
        }));
        const result = await Promise.all(promiseArray).catch((err)=>{
            res.status(501).json({
                error: err.message,
                stack: err.stack
            });
        });
        [data.genres,data.groups, data.watchlist, data.recent] = result;
        res.json(data);
    });
});

router.get('/create-group', async (req,res,next)=>{
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        db.group.create(fields).then((response) => {
            res.json(response);
        }).catch((err) => {
            res.status(501).json({
                err: err.message,
                stack: err.stack
            });
        });
    });
});

router.get('/similar', async (req,res,next) => {
    const id = req.query.id;
    if(!id){
        res.status(401).json({
            message: "No Show Id"
        });
    }else{
        const genres = await db.genre.bulkFindCategory(id);
        const body = {
            genre_arr: genres
        };
        let result = search(body,true).filter(x => x.id !== id).map((x)=>{
            return {
                id: x.item.id,
                name: x.item.name,
                original_name: x.item.original_name,
                poster_portrait_url: x.item.poster_portrait_url
            }
        }).splice(0,10);
        res.json(result);
    }
});

router.post('/insert-show', async (req, res, next)=>{
    req.body = JSON.parse(JSON.stringify(req.body));
    const result = await db.shows.findByOriginalName(req.body.original_name).catch(e=>{
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
        const newResponse = await db.shows.create(req.body).catch(e=>{
            res.json({
                message : e
            });
        });
        if(newResponse){
            const data = await db.shows.findByOriginalName(req.body.original_name).catch(e=>{
                res.json({
                    message : e
                });
            });
            if(data){
                res.json({
                    show_id : data.id,
                    message : req.body.name+" (Season) already added"
                });
            }
        }
    }
});

module.exports = router;

