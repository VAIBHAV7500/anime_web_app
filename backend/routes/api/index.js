const express = require('express');
const router = express.Router();

const videoRouter = require('./video');
const userRouter = require('./user');
const showsRouter = require('./shows');
const searchRouter = require('./search');
const genreRouter = require('./genre');
const characterRouter = require('./characters');
const reviewRouter = require('./review');
const listRouter = require('./list');
const notificationRouter = require('./notification');
const orderRouter = require('./order');
const tempRouter = require('./temp');

router.use('/video', videoRouter);
router.use('/user', userRouter);
router.use('/shows', showsRouter);
router.use('/search', searchRouter);
router.use('/genre', genreRouter);
router.use('/character', characterRouter);
router.use('/review', reviewRouter);
router.use('/list', listRouter);
router.use('/notification',notificationRouter);
router.use('/order',orderRouter);
router.use('/temp',tempRouter);

module.exports = router;
