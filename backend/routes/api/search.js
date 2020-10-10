const express = require('express');
const router = express.Router();
const {search} = require('../../lib/search');


/* GET users listing. */
router.post('/suggestions', async function (req, res, next) {
    const body = req.body;
    const filter = req.query.filter ? true : false;
    let result = search(body,filter);
    const resultJson = result.map((x)=>{
        return {
            id: x.item.id,
            name: x.item.name,
            original_name: x.item.original_name,
            poster_portrait_url: x.item.poster_portrait_url,
        }
    })
    res.json(resultJson);
});



module.exports = router;