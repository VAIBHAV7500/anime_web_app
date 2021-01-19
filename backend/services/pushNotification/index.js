const Discord = require("discord.js");
const { discordConfig } = require("../../config");
const client = new Discord.Client();
client.login(discordConfig.BOT_TOKEN);

const sendMessage = (message) => {
    const hook = new Discord.WebhookClient(discordConfig.WEBHOOK_ID,discordConfig.WEBHOOK_TOKEN);
    hook.send(message);
} 
module.exports = {
    sendMessage
}