const { Message, Client, Intents, MessageEmbed, Collection } = require('discord.js')
const fs = require('fs')
require('dotenv').config()
const token = process.env.token
const client = new Client({ws: {intents: Intents.ALL}})
module.exports = client;
client.commands = new Collection();
client.cooldowns = new Collection();


["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`${client.user.tag} has Logged in!`)
})


client.login(token)