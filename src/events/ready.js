var colors = require("colors");
colors.enable();
const { ActivityType } = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await client.user.setPresence({ status: "idle" });
        console.log(`[BOT] Ready! ${client.user.tag} is online!`.green);
    },
};
