const { SlashCommandBuilder, Interaction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    /**
     *
     *
     * @param {Interaction} interaction
     */
    async execute(interaction, client, config) {
        const { options, guild, user } = interaction;
        interaction.reply({ content: "Pong!" });
        return;
    },
};
