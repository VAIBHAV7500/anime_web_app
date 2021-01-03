const keys = require('../../config/keys.json');
const mailConfig = require('../../config/mail.json');
const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = keys.sendgrid.key;
sgMail.setApiKey(sendgridAPIKey);

const sendMail = async (body) => {
    const to = body.to;
    const subject = body.subject;
    const text = body.text;
    const html = body.html;

    const msg = {
        to, // Change to your recipient
        from: 'staging@animei.tv', // Change to your verified sender
        subject,
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

const body = {
    to : "vbhvsolanki7500@gmail.com",
    subject: "Greetings from Animei TV",
    text: "OTP: 123",
    html: "Hi this is <strong>Animei TV</strong>"
}
sendMail(body);

module.exports = {
    sendMail
}