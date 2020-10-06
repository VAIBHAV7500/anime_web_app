var express = require('express');
var router = express.Router();
const apiVideo = require('@api.video/nodejs-sdk');
const keys = require('../../config/keys.json');
const formidable = require("formidable");
const db = require('../../db');
const { json } = require('express');

const client = new apiVideo.ClientSandbox({
    apiKey: keys.api_video.apiKey
});
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/',(req,res,next)=>{
    //1. PROCESS THE REQUEST HERE 
    //2. SEND THE VIDEO
    console.log(res.body);
    const file_name = 'anniversary2.mp4';
    const video = {
        //videoUrl: `http://gdurl.com/qELA`,
        videoUrl: `https://cdn.api.video/vod/viksunQEzGp5svYdVtzI5RW/hls/manifest.m3u8`,
        title: 'Vinland Saga Trailer'
    }
    res.json(video);
});

/**
 * Schema for this upload would be 
 * {
 *     video: [filed]
 *     title: [Name of the file]
 *     video_length: [this is video's length]
 *     intro_start_time: ,
 *      intro_end_time TIME,
        recap_start_time TIME,
        recap_end_time TIME,
        closing_start_time TIME,
        closing_end_time TIME,
        quality INT,
        type VARCHAR(255),
        show_id BIGINT,
 * }
 */
router.post('/upload', async (req,res,next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = process.env.UPLOAD_DIR;
    console.log(form.uploadDir);
    form.parse(req,async (err,fields,files)=>{
        if(err) throw err;
        console.log("Fields: ");
        console.log(JSON.stringify(fields));
        if(fields.api_key && fields.api_key === keys.app.apiKey){
            console.log("Api Key Matched");
            console.log("Files: " + JSON.stringify(files));
            let startUploadTimer = new Date().toLocaleString();
            console.log("Uploading Start at : ", startUploadTimer);

            let result = await client.videos.upload(files.source.path, {
                title: fields.title,
                mp4Support: true
            });
            startUploadTimer = new Date().toLocaleString();
            console.log("Uploading End at : ", startUploadTimer);
            console.log(result);
            fields["url"] = result.assets.hls,
            db.videos.create(fields);
            res.json({
                message: "Happy Uploading!. Verify the video at Dashboard"
            });
        }
        else{
           res.status(401).json({
               message: "API KEY is missing or incorrect"
           })
        }
    });
});

router.get('/episodes', async(req,res,next)=>{
    if(req.query.show_id){
        const from = req.query.from;
        const to = req.query.to;
        let result = await db.videos.getShows(req.query.show_id, from, to).catch((err)=>{
            res.status(501).json({
                success: false,
                err: err.message,
                stack: process.env.NODE_ENV="development" ?  err.stack : ""
            });   
            return;
        });
        result = result.map((x)=>{
            return {
                id: x.id,
                name: x.name,
                type: x.type,
                episode: x.episode_number,
                thumbnail_url: x.thumbnail_url,
            }
        });
        console.log(result);
        res.json(result);
    }else{
        res.status(401).json({
            success: false,
            error: "No Show Id"
        });
        return;
    }
});

router.post('/create', async (req, res, next)=>{
    req.body = JSON.parse(JSON.stringify(req.body));
    const result = await db.videos.findByEpisodeName(req.body.name,req.body.show_id).catch(e=>{
        console.log(e);
        res.json({
            message : e
        });
    });
    if(result){
        res.json({
            message : "already added episode " + req.body.episode_number
        })
    }else{
        await db.videos.create(req.body).catch(e=>{
            console.log(e);
            res.json({
                message : e
            });
        });
        res.json({
            message : "added episode " + req.body.episode_number,
        })
    }
});

router.get('/trending',async (req,res,next)=>{
    if(!req.query.api_key || req.query.api_key !== keys.app.apiKey){
        res.status(401).json({
            message: "API KEY is missing or incorrect"
        })
    }
    const videos = [12,13,10,9,8,6];
    const promiseArray = [];
    videos.forEach((id)=>{
        promiseArray.push(new Promise((res,rej)=>{
            db.shows.find(id).then((show)=>{
                res(show);
            }).catch((err)=>{
                rej(err);
            });
        }));
    });
    const result = await Promise.all(promiseArray).catch((err)=>{
        res.status(500).json({
            error: err.message,
            stack: err.stack
        })
    });
    res.json(result);
});

router.get('/banner', async (req, res, next) => {
    const result = await db.shows.forBanner().catch((err)=>{
        return res.status(501).json({
            error: err.message,
            stack: err.stack,
        });
    }) 
    res.json(result);
});

router.get('/genre',async (req,res,next)=>{
    const id = req.query.genre_id;
    if(!id)
    {
        res.status(401).json({
            message: "Id is blank"
        });
        return;
    }
    const genre_id = await db.genre.findByGenre(id); // Later remove it
    console.log(genre_id);
    let result = await db.shows.getShowsByGenre(genre_id.id).catch((err)=>{
        res.status(401).json({
            err: err.message,
            stack: err.stack
        });
    });
    res.json(result);
});


module.exports = router;


