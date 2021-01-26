var express = require('express');
var router = express.Router();
var db = require('../../db/index');
const { response } = require('../../app');
const {resetPasswordSchemaCheck} = require('../../services/middleware');

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

router.get('/details', async(req,res,next)=>{
    const id = req.query.id;
    if(id){
        const result = await db.user.find(id).catch((err)=>{
            res.status(501).json({
                error: err.message
            });
        });
        if(result){
            res.json(result);
        }
    }else{
        res.status(401).json({
            message: "No User Id"
        })
    }
});

router.get('/reset-password',resetPasswordSchemaCheck,async(req,res,next) => {
    const user_id = req.body.user_id;
    const password = req.body.password;
    await db.user_verification.destroy(user_id);
    await initiateUserVerification(user_id,password).catch((err) => {
        res.status(403).send();
    });
    res.status(200).send();
});

module.exports = router;
