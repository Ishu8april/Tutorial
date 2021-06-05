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

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.permissions && message.guild) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return;
        }
    }

    if (command.clientperms && message.guild) {
        const clientPerms = message.channel.permissionsFor(message.guild.me);
        if (!clientPerms || !clientPerms.has(command.permissions)) {
            return message.guild.owner.send('I dont have Permissions in your server!')
        }
    }

    if (command.args && !args.length) {
        let reply = `This Command Requires Arguments but you didnt specify any!`;

        if (command.usage) {
            reply += `\nThe correct usage of this command is: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(
            new Discord.MessageEmbed()
                .setTitle(`Invalid Command Usage!`)
                .setDescription(`**${reply}**`)
                .setColor("RED")
        )
    }

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.channel.send(new Discord.MessageEmbed().setTitle(`ERROR`).setDescription('I cannot execute that command in DMs as this command is Guild Only!').setColor('RED'));
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(new Discord.MessageEmbed().setTitle('⏲ COOLDOWN ⏲').setDescription(`Please wait ${timeLeft.toFixed(1)} more second(s) before Using the \`${command.name}\` command again.`).setColor('RED'));
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});
