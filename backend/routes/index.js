var express = require('express');
var router = express.Router();

var apiRouter = require('./api');

router.use('/api', apiRouter);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
