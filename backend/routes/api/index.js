const express = require('express');
const router = express.Router();

const videoRouter = require('./video');
const userRouter = require('./user');
const showsRouter = require('./shows');
const searchRouter = require('./search');
const genreRouter = require('./genre');
const characterRouter = require('./characters');
const reviewRouter = require('./review');
const watchlistRouter = require('./watchlist');

router.use('/video', videoRouter);
router.use('/user', userRouter);
router.use('/shows', showsRouter);
router.use('/search', searchRouter);
router.use('/genre', genreRouter);
router.use('/character', characterRouter);
router.use('/review', reviewRouter);
router.use('/list', watchlistRouter);

module.exports = router;
