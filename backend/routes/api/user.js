var express = require('express');
var router = express.Router();
var db = require('../../db/index');
const { response } = require('../../app');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    console.log(req.query);
    //need to put checks
    const resp = await db.user.find_by_email(req.query.email);
    console.log(resp);
    res.send(resp);
});

router.post('/create', async (req, res, next) => {
    //here need to put checks 
    const response = await db.user.create(req.body);
    res.json({"message":response});
});


module.exports = router;
