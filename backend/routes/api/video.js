var express = require('express');
var router = express.Router();
const apiVideo = require('@api.video/nodejs-sdk');
const formidable = require("formidable");
const db = require('../../db');
const { json } = require('express');
const {isPaid} = require('../../lib/order');

const client = new apiVideo.ClientSandbox({
    apiKey: "1234"
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
        videoUrl: `https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8`,
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
    });
});

router.get('/episodes', async(req,res,next)=>{
    if(req.query.show_id && req.query.offset && req.query.user_id){ 
        const latest = req.query.latest === 'true' ? true : false;
        let from = parseInt(req.query.from || 1);
        const rows = await db.shows.totalShows(req.query.show_id);
        const showId = req.query.show_id;
        const userId = req.query.user_id;
        const isPremium = await isPaid(userId);
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
            })
        }));
        promiseArray.push(new Promise((res,rej)=>{
            db.user_player_session.findByShowId(showId, userId).then((result)=>{
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
                const body = {
                    id: x.id,
                    name: x.name,
                    episode: x.episode_number,
                    thumbnail_url: x.thumbnail_url,
                    progress: episodeProgress.length ? episodeProgress[0].covered_percentage : 0,
                }
                if(isPremium){
                    body.type = x.type;
                }
                return body;
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
    const videos = [25,30,124,114,122,10,58,127,77,84];
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
    // result = await db.banners.getBanners();
    // console.log(result);
    // res.json(result);
    const videos = [25,30,124,114,122,10,58,127,77,84];
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
    let result = await db.shows.getShowsByGenre(genre_id.id).catch((err)=>{
        res.status(401).json({
            err: err.message,
            stack: err.stack
        });
    });
    const show_ids = result.map(x => x.id);
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
    const userId = req.query.user_id;
    if(!videoId || !userId){
        res.status(401).json({
            message: "Info not sufficient..."
        });
    }else{
        const isPremium = await isPaid(userId);
        const promiseArray = [];
        promiseArray.push(new Promise((res,rej)=>{
            db.videos.find(videoId).then((result)=>{
                res(result);
            }).catch((err)=>{
                rej(err);
            });
        }));
        promiseArray.push(new Promise((res,rej)=>{
            db.user_player_session.findByVideoId(videoId, userId).then((result)=>{
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
        if(!isPremium){
            result.type = null;
        }
        //================== Temperorary Change ================

        result.intro_start_time = 0;
        result.intro_end_time = 22;
        result.closing_start_time = 120;
        result.closing_end_time = 135;
        result.next_show = 20;
        result.url = "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8";

        //=================================================//
        result.progress = progress.length ? progress[0].covered_percentage : 0;
        result.premium = isPremium;
        res.json(result);
    }
});

router.post('/sessions', async (req,res,next)=>{
    const body = req.body;
    if([body.user_id, body.video_id, body.covered, body.show_id].includes(null)){
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
        });

        // if(body.covered >= 80){
        //     db.completed_shows.create({
        //         user_id: body.user_id,
        //         show_id: body.show_id
        //     });
        // }
        res.json({
            message: "OK"
        })
    }
});


module.exports = router;


