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
    const genres = await db.genre.bulkFindCategory(genre_ids);
    data.genres = genres;

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

module.exports = router;