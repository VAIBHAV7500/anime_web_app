const express = require('express');
const router = express.Router();

const videoRouter = require('./video');
const userRouter = require('./user');
const showsRouter = require('./shows');
const searchRouter = require('./search');
const genreRouter = require('./genre');
const characterRouter = require('./characters');


router.use('/video', videoRouter);
router.use('/user', userRouter);
router.use('/shows', showsRouter);
router.use('/search', searchRouter);
router.use('/genre', genreRouter);
router.use('/character', characterRouter);

module.exports = router;
