const fs = require('fs')
module.exports = (client) => {
    fs.readdirSync('./commands/').forEach(dir => {
        const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
        for (let file of commands) {
            let cmd = require(`../commands/${dir}/${file}`);
            if (cmd.name) {
                client.commands.set(cmd.name, cmd);
            }
        }
    })
    fs.readdirSync("./events").forEach((file) => {
        const events = fs.readdirSync("./events").filter((file) => file.endsWith(".js"));

        for (let file of events) {
            let pull = require(`../events/${file}`);

            if (pull.name) {
                client.events.set(pull.name, pull);
            } else {
                continue;
            }
        }
    });
}