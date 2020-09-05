var express = require('express');
var router = express.Router();
const keys = require('../config/keys.json');
const formidable = require("formidable");
const db = require('../db/index');



router.post('/create',async (req,res,next)=>{
    const form = new formidable.IncomingForm();
    form.uploadDir = process.env.UPLOAD_DIR;
    console.log(form.uploadDir);
    form.parse(req,(err,fields)=>{
        if(err){throw err};
        if(fields.api_key && fields.api_key === keys.app.apiKey){
            delete fields["api_key"];
            db.shows.create(fields).then((result)=>{
                res.json(result);
            }).catch((err)=>{
                res.status(500).json({
                    success: false,
                    message: err.message,
                    stack: err.stack
                });
            });
            
        }
        else{
            res.status(401).json({
                message: "API key is wrong or not there"
            });
        }
    });
});

module.exports = router;