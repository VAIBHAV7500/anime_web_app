const Discord = require("discord.js");
const { discordConfig } = require("../../config");
const {getLogger} = require('../../lib/logger');
const logger = getLogger('discord');
const client = new Discord.Client();
client.login(discordConfig.bot_token);

const sendMessage = async (message, channel = "dev_notifications") => {
    try{
        const webhookId = discordConfig.channels[channel].webhook_id;
        const webhookToken = discordConfig.channels[channel].webhook_token;
        const hook = new Discord.WebhookClient(webhookId,webhookToken);
        const result =  await hook.send(message);
        logger.info(result);
    }catch(e){
        logger.error(e);
    }
} 
module.exports = {
    sendMessage
}