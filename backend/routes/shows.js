var express = require('express');
var router = express.Router();
const keys = require('../config/keys.json');
const formidable = require("formidable");
const db = require('../db/index');

router.post('/create',async (req,res,next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = process.env.UPLOAD_DIR;
    console.log(form.uploadDir);
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
    if(!id){
        res.status(401).json({
            error: "No Id found",
        });
        return;
    }
    let data = await db.shows.find(id, true);
    const genre_ids = data.genre_id;
    const promiseArray = [];
    promiseArray.push(new Promise((res,rej)=>{
        db.genre.bulkFindCategory(genre_ids).then((result)=>{
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
    const result = await Promise.all(promiseArray);
    [data.genres,data.groups] = result;
    res.json(data);
});

router.get('/create-group', async (req,res,next)=>{
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        console.log(fields);
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

router.post('/insert-show', async (req, res, next)=>{
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
        const newResponse = await db.shows.create(req.body).catch(e=>{
            console.log(e);
            res.json({
                message : e
            });
        });
        if(newResponse){
            const data = await db.shows.findByOriginalName(req.body.original_name).catch(e=>{
                console.log(e);
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

