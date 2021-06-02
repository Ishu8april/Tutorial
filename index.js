const { Message, Client, Intents, MessageEmbed } = require('discord.js')
require('dotenv').config()

const client = new Client({
    ws: {
        intents: Intents.ALL
    }
})

client.on("ready", () => {
    console.log(`${client.user.tag} has Logged in!`)
})

client.on("message", async(message) => {
    if (message.content == 'ping') {
        let msg = await message.channel.send('Pinging.....🏓')
        await msg.edit(`Ping: ${client.ws.ping}, Message Edit ping: ${msg.createdTimestamp-message.createdTimestamp}`)
    }
})

client.login(process.env.token)