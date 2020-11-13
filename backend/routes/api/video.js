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
    form.parse(req,async (err,fields,files)=>{
        if(err) throw err;
        if(fields.api_key && fields.api_key === keys.app.apiKey){
            let startUploadTimer = new Date().toLocaleString();

            let result = await client.videos.upload(files.source.path, {
                title: fields.title,
                mp4Support: true
            });
            startUploadTimer = new Date().toLocaleString();
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
    if(req.query.show_id || req.query.offset){ 
        const latest = req.query.latest === 'true' ? true : false;
        let from = parseInt(req.query.from || 1);
        const rows = await db.shows.totalShows(req.query.show_id);
        const showId = req.query.show_id;
        if(latest && req.query.from === undefined){
            if(rows && rows.length != 0){
                from = rows[0].total_episodes;
            }
        }
        const offset = parseInt(req.query.offset);
        const to = from + (latest ? -1 : 1) * offset;
        const promiseArray = [];
        promiseArray.push(new Promise((res,rej)=>{
            db.videos.getShows(req.query.show_id, from, to, latest).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            })
        }));
        promiseArray.push(new Promise((res,rej)=>{
            db.user_player_session.findByShowId(showId).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            });
        }));
        let [episodes,progress] = await Promise.all(promiseArray).catch((err)=>{
            res.status(501).json({
                success: false,
                err: err.message,
                stack: process.env.NODE_ENV="development" ?  err.stack : ""
            });   
            return;
        });
        
        let totalEpisodes = rows[0] && rows[0].total_episodes;
        if(episodes && episodes.length){
            episodes = episodes.map((x)=>{
                const episodeProgress = progress.filter(pr => pr.video_id === x.id);
                return {
                    id: x.id,
                    name: x.name,
                    type: x.type,
                    episode: x.episode_number,
                    thumbnail_url: x.thumbnail_url,
                    progress: episodeProgress.length ? episodeProgress[0].covered_percentage : 0,
                }
            });
        }
        res.json({
            result: episodes,
            total_episodes: totalEpisodes
        });
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
    const videos = [12,13,10,9,8,6,2,15];
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
    const show_ids = result.map(x => x.id);
    console.log(show_ids);
    const genres = await db.genre_show_mapping.findGenreByShows(show_ids);
    result.map((show)=>{
        const genre = genres.filter(x => x.show_id === show.id).map(x => x.category);
        show['genres'] = genre;
        return show;
    });
    res.json(result);
});


router.get('/details',async (req,res,next)=>{
    const videoId = req.query.player_id;
    console.log(videoId);
    if(!videoId){
        res.status(401).json({
            message: "Info not sufficient..."
        });
    }else{
        const promiseArray = [];
        promiseArray.push(new Promise((res,rej)=>{
            db.videos.find(videoId).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            })
        }));
        promiseArray.push(new Promise((res,rej)=>{
            db.user_player_session.findByVideoId(videoId).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            });
        }));
        const [result,progress] = await Promise.all(promiseArray).catch((err)=>{
            res.status(501).json({
                success: false,
                err: err.message,
                stack: process.env.NODE_ENV="development" ?  err.stack : null
            });   
            return;
        });
        result.progress = progress.length ? progress[0].covered_percentage : 0;
        res.json(result);
    }
});

router.post('/sessions', async (req,res,next)=>{
    const body = req.body;
    if([body.user_id, body.video_id, body.covered, body.show_id].includes(null)){
        console.log(body.user_id);
        console.log(body.show_id);
        console.log(body.video_id);
        console.log(body.covered);
        res.status(401).json({
            message: "Not enough info!"
        });
    }
    else{
        const recordBody = {
            covered_percentage: body.covered,
            user_id: body.user_id,
            video_id: body.video_id,
            show_id: body.show_id
        }
        await db.user_player_session.upsertRecord(recordBody).catch((err)=>{
            console.log(err);
            res.status(501).json({
                message: err.message,
                stack: err.stack
            })
        })
        res.json({
            message: "OK"
        })
    }
});


module.exports = router;


