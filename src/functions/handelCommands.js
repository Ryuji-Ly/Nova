const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
var colors = require("colors");
colors.enable();

const clientId = "1297871815711916043"; //to be changed

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`${path}/${folder}`)
                .filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({
            version: "9",
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log(
                    `[BOT] Started refreshing ${client.commandArray.length} application (/) commands.`
                        .blue
                );

                await rest.put(Routes.applicationCommands(clientId), {
                    body: client.commandArray,
                });

                console.log(
                    `[BOT] Successfully reloaded ${client.commandArray.length} application (/) commands.`
                        .blue
                );
            } catch (error) {
                console.error(`[COMMAND HANDLER] ${error}`.red);
            }
        })();
    };
};
