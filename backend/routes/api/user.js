var express = require('express');
var router = express.Router();
var db = require('../../db/index');
const { response } = require('../../app');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    //need to put checks
    const resp = await db.user.find_by_email(req.query.email);
    res.send(resp);
});

router.post('/create', async (req, res, next) => {
    //here need to put checks 
    const response = await db.user.create(req.body);
    res.json({"message":response});
});

router.post('/getId', async (req,res,next)=>{
    if(req.body.email){
        const response = await db.user.find_by_email(req.body.email).catch((err)=>{
            res.status(401).json({
                error: err.message,
                stack: err.stack
            });
        });
        if(response){
            res.json({
                id : response.id
            });
        }else{
            res.status(404).json({
                id : null,
                message : "No Email exist"
            });
        }
    }else{
        res.status(404).json({
            id : null,
            message : "No Email exist"
        });
    }
})

module.exports = router;
