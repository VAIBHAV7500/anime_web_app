const sgMail = require('@sendgrid/mail');
const { logger } = require('handlebars');
const fs = require('fs');

const sendgridAPIKey = process.env.SENDGRID_KEY;
sgMail.setApiKey(sendgridAPIKey);

const generateMailBody = (file) => {
    const filePath = './lib/mailer/body/' + file + '.html';
    return new Promise((res,rej) => {
        fs.readFile(filePath, (err, data) => {
            if (err){
                rej(err);
            }else{
                res(data.toString());
            }
          });
    });
}

const sendMail = async (body, retry = 0) => {
    const toMail = [];
    if(body.to){
        body.to.forEach((mail)=>{
            toMail.push({
                "email": mail
            });
        })
    }
    const ccMail = [];
    if(body.cc){
        body.cc.forEach((mail)=>{
            ccMail.push({
                "email": mail
            });
        })
    }
    
    const subject = body.subject;
    const text = body.text;
    const html = body.html;
    const personalizations = [{
        "to": toMail,
        "cc": ccMail,
        "subject": subject
    }];

    const msg = {
        to: toMail[0],
        from: 'no-reply@animeistag.net',
        subject: subject,
        text: text,
        html: html,
    }

    await new Promise((res,rej) => {
        sgMail
        .send(msg)
        .then((result) => {
            res(result);
        })
        .catch((error) => {
            rej(error);
        });
    }).catch((err) => {
        logger.error(err);
        if(retry < 3) {
            sendMail(body,retry+1);
        }
    });
}

module.exports = {
    sendMail,
    generateMailBody
}