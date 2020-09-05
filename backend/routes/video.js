var express = require('express');
var router = express.Router();
const apiVideo = require('@api.video/nodejs-sdk');
const keys = require('../config/keys.json');
const formidable = require("formidable");
const db = require('../db/index');

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
        videoUrl: `https://cdn.api.video/vod/vi6a5paBPx5p3EdaXu5E6izq/hls/manifest.m3u8`,
        title: 'Naruto Trailer'
    }
    res.json(video);
});

/**
 * Schema for this upload would be 
 * {
 *     api_key: string
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
router.post('/upload', (req,res,next)=>{
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
        }
    });
    res.json({
        message: "Happy Uploading!. Verify the video at Dashboard"
    });
});

router.get('/trending',async (req,res,next)=>{
    if(!req.query.api_key || req.query.api_key !== keys.app.apiKey){
        res.status(401).json({
            message: "API KEY is missing or incorrect"
        })
    }
    const videos = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
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
    if (!req.query.api_key || req.query.api_key !== keys.app.apiKey) {
        res.status(401).json({
            message: "API KEY is missing or incorrect"
        })
    }
    const videos = [1, 1, 1, 1];
    const promiseArray = [];
    videos.forEach((id) => {
        promiseArray.push(new Promise((res, rej) => {
            db.shows.find(id).then((show) => {
                res(show);
            }).catch((err) => {
                rej(err);
            });
        }));
    });
    const result = await Promise.all(promiseArray).catch((err) => {
        res.status(500).json({
            error: err.message,
            stack: err.stack
        })
    });
    res.json(result);
});


module.exports = router;
