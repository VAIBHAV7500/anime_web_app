const whiteList = require('../config/list/whitelist');
const axios = require('axios');
const Joi = require('joi');
const {logger} = require('../lib/logger');

const userSchema = Joi.object({
    name: Joi.string().required().max(100),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@#!$%^&*~]).{8,}$')).required(),


    plan_id: Joi.number()
        .integer(),

    email: Joi.string()
        .email({ 
            multiple: false,
            allowUnicode: false,
            tlds : {
                allow: true
            }
        })
        .required()
})

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
            if(whiteList.includes(origin)){
                next();
            }else {
                const error = new Error(`${req.originalUrl} not found!!!`);
                logger.error(error);
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

const checkIp = async (ip, retry = 0) => {
    const baseUrl = 'https://api.ipgeolocationapi.com/';
        const endPoint = `${baseUrl}geolocate/${ip}`;
        const response = await axios.get(endPoint).catch((err)=>{
            logger.error(err);
    });
    if(!response){
        if(retry <3){
            console.log('Retrying GeoLocation');
            checkIp(ip,retry+1);
        }
    }
    return response;
}

const geoBlockCheckMiddleware = async (req,res,next) => {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    if(ip){
        const response = await checkIp(ip); 
        if(response){
            console.log(response.data.alpha2);
            const country = response.data.alpha2;
            console.log(country);
            // if(country !== "IN"){
            //     res.status(403).json({
            //         message: "Geo Blocked!!"
            //     });
            // }
        }
    }
    console.log('Checking Geo Block ' + ip);
    next();
}

const userSchemaCheck = (req,res,next) => {
    const body = req.body;
    const { error, value } = userSchema.validate(body);
    if(error){
        res.status(401).json(error);
    }else{
        next();
    }
}

module.exports = {
    anyError,
    errorHandler,
    apiMiddleware,
    geoBlockCheckMiddleware,
    userSchemaCheck
}