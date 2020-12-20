// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
const awsConfig = require('../../config/awsConfig.json');
const mailConfig = require('../../config/mail.json');
// Set the region 
AWS.config.update({region: awsConfig.region});

// Create sendBulkTemplatedEmail params 

const sendMail = async (body) => {
    let destination = {};
    if(body.cc_address){
        destination.CcAddresses = body.cc_address;
    }
    if(body.to_address){
        destination.ToAddresses = body.to_address;
    }

    let message = {};
    if(body.data){
        message = {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: body.data
                }
            }
        };
    };

    if(body.subject){
        message.Subject = {
            Charset: "UTF-8",
            Data: body.subject
        }
    }
    let source = mailConfig.default_reply_to;
    if(body.source){
        source = body.source;
    }
    let replyTo = [];
    if(body.reply_to){
        replyTo = body.reply_to
    }else{
        replyTo = [source];
    }

    const params = {
        Destination: destination,
        Message: message,
        Source: source,
        ReplyToAddresses: replyTo
    }

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    return sendPromise;
}

module.exports = {
    sendMail
}