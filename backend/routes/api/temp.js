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

router.get('/create', async (req, res, next) => {
    //here need to put checks 
    const email = req.query.email;
    const password = '4c2db4a17c31e34a14d65f190ac1ea5f72c5d181683a560a5639ae32aeb6c37f';
    const body = {
      email,
      password
    };
    const response = await db.user.create(body).catch((err)=>{
      res.status(501).json({
        message: err.message,
        stack: err.stack
      });
    })
    if(response){
      const id = response.insertId;
      if(id){
        db.notification_engagements.welcomeNotification(1,id);
      }
      res.json({"message":response});
    }
});

module.exports = router;
