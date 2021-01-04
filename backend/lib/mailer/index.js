const keys = require('../../config/keys.json');
const mailConfig = require('../../config/mail.json');
const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = keys.sendgrid.key;
sgMail.setApiKey(sendgridAPIKey);

const sendMail = async (body) => {
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

    const to = body.to;
    const subject = body.subject;
    const text = body.text;
    const html = body.html;
    const personalizations = [{
        "to": toMail,
        "cc": ccMail,
        "subject": subject
    }];

    const msg = {
        from: {
            "email": 'staging@animei.tv'
        }, // Change to your verified sender
        personalizations,
        text,
        html,
    }
      
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

// const body = {
//     to : ["vaibhav@animei.tv"],
//     subject: "Greetings from Animei TV",
//     text: "OTP: 123",
//     html: "Hi this is <strong>Animei TV</strong>"
// }
// sendMail(body);

module.exports = {
    sendMail
}