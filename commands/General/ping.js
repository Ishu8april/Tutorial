const { Message, Client, MessageEmbed} = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'Sends the bot ping!',
    args: true,
    usage: '<@user>',
    execute: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging...`)
        const embed = new MessageEmbed()
            .setTitle('Pong!')
            .setDescription(`WebSocket ping is ${client.ws.ping}MS\nMessage edit ping is ${Math.floor(msg.createdAt - message.createdAt)}MS!`)
        await message.channel.send(embed)
        msg.delete()
    }
}
