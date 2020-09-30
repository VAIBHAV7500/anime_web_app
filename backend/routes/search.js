const express = require('express');
const router = express.Router();
const {search} = require('../lib/search');

/* GET users listing. */
router.get('/suggestions', async function (req, res, next) {
    try{ 
        const results = search(req.query.key);
        res.send({
            results,
        });
    }catch(err){
        res.status(501).json({
            error: err,
        })
    }
});



module.exports = router;
