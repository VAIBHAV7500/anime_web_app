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
        videoUrl: `https://storage.googleapis.com/coral-burner-287102/1TQ75EQHYSVC/22a_1598098882_40471.mp4`
    }
    res.json(video);
});


module.exports = router;
