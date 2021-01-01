const whiteList = require('../config/list/whitelist');
const blackList = require('../config/list/blacklist');

const anyError = (req, res, next) => {
    const error = new Error(`${req.originalUrl} not found!!!`);
    res.status(404);
    next(error);
}

const errorHandler = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.ENV === 'dev' ? err : {};
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message
    });
}

const apiMiddleware = (req,res,next) => {
    if(process.env.NODE_ENV !== "production"){
        next();
    }else{
        const referrer = req.header('Referer') || '';
        const splits = referrer.split('/');
        if(splits.length >= 2){
            const origin = splits[2];
            console.log(origin);
            if(whiteList.includes(origin)){
                next();
            }else {
                const error = new Error(`${req.originalUrl} not found!!!`);
                res.status(404);
                next(error);
            }
        }else {
            const error = new Error(`${req.originalUrl} not found!!!`);
            res.status(404);
            next(error);
        }
    }
}

const geoBlockCheckMiddleware = (req,res,next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Checking Geo Block ' + ip);
    next();
}

module.exports = {
    anyError,
    errorHandler,
    apiMiddleware,
    geoBlockCheckMiddleware
}