const client = require("../index")
require('dotenv').config()
const Discord = require('discord.js')

let prefix = process.env.prefix
const token = process.env.token

function emoji(id) {
    return client.emojis.cache.get(id).toString();
}

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName)

    if (command.args && !args.length) {
        let reply = `This Command Requires Arguments but you didnt specify any!`;

        if (command.usage) {
            reply += `\nThe correct usage of this command is: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(`${emoji('850257294032633867')} Invalid Command Usage! ${emoji('850257294032633867')}`)
                .setDescription(`**${reply}**`)
                .setColor("RED")
        )
    }

    try {
        client.commands.get(command).execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});