const { Interaction } = require("discord.js");
const profileModel = require("../models/profileSchema");
const handleCooldowns = require("../utils/handleCooldowns");
var colors = require("colors");
colors.enable();

module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {Interaction} interaction
     * @param {*} client
     * @returns
     */
    async execute(interaction, client) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        let profileData;
        try {
            profileData = await profileModel.findOne({ userId: interaction.user.id });
            if (!profileData) {
                profileData = await profileModel.create({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                });
            }
        } catch (err) {
            console.log(`[INTERACTION CREATE] ${err.stack}`.red);
        }
        const cooldowns = [];
        const cooldown = cooldowns[interaction.commandName];
        if (cooldown) {
            const result = await handleCooldowns(interaction, cooldown);
            if (!result) return;
        }
        //execute the command
        try {
            await command.execute(interaction, client, profileData);
        } catch (error) {
            console.log(
                `[INTERACTION CREATE] ${error.stack}\n[BOT] ${interaction.user.username} used ${
                    interaction.commandName
                } at ${new Date(Date.now())}`.red
            );
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
