var express = require('express');
var router = express.Router();

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
        //videoUrl: `https://www3.mp4upload.com:282/d/r2xurlz7z3b4quuojsxagnkqikj3l2yedpgcsieqjiydaudqzn33xry2/rezb_7.mp4`,
        videoUrl: `http://localhost:4200/videos/${file_name}`,
        title: 'Anniversary Video'
    }
    res.json(video);
});


module.exports = router;
