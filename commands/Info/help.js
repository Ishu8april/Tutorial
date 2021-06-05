const { Client, Message, MessageEmbed } = require('discord.js');
require('dotenv').config()
const prefix = process.env.prefix

module.exports = {
    name: 'help',
    description: 'Help Menu',
    aliases: ['h'],
    usage: ['command'],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    execute(client, message, args){
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(commands.map(command => `|\`${command.name}\`|`).join(' '));
            let embed = new MessageEmbed().setTitle('Help Menu').setDescription(`You can send \`${prefix}help [command name]\` to get info on a specific command!`).addField('Commands', data)

            return message.author.send(embed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        let embed = new MessageEmbed()
            .setTitle('Help Menu')
            .setDescription('<> Means Required Arguments, [] means optional Arguments')
            .addFields({ name: 'Name', value: command.name }, { name: 'Description', value: !command.description ? "No Description Provided " : command.description }, { name: 'Aliases', value: !command.aliases ? "No Aliases for this Command" : command.aliases.join(', ') }, { name: 'Usage', value: !command.usage ? `${prefix}${command.name}` : `${prefix}${command.name} ${command.usage}` })

        message.channel.send(embed);
    }
}