const { Interaction, time } = require("discord.js");
const profileModel = require("../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");

/**
 * @param {Interaction} interaction
 */
const handleCooldowns = async (interaction, cooldown) => {
    let subname = "";
    try {
        subname = interaction.options.getSubcommand();
    } catch (error) {
        subname = "";
    }
    let value = interaction.commandName;
    if (subname !== "") value = `${interaction.commandName} ${subname}`;
    const name = `${value}`;
    try {
        let user = await profileModel.findOne({ userId: interaction.user.id });
        if (!user) {
            user = await profileModel.create({
                userId: interaction.user.id,
                guildId: interaction.guild.id,
            });
        }
        if (cooldown > 0) {
            let cooldownData = user.cooldowns.find((cd) => cd.name === name);
            if (!cooldownData) {
                user.cooldowns.push({ name: name, value: 0 });
                cooldownData = user.cooldowns.find((cd) => cd.name === name);
            }
            const lastUsed = cooldownData.value;
            const timeLeft = cooldown - (Date.now() - lastUsed);
            if (timeLeft > 0) {
                const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
                await interaction
                    .reply(
                        `You need to wait ${hours} hours, ${minutes} minutes, and ${seconds} seconds before using this command again!`
                    )
                    .catch(async (e) => {
                        await interaction
                            .editReply(
                                `You need to wait ${hours} hours, ${minutes} minutes, and ${seconds} seconds before using this command again!`
                            )
                            .catch(async (e) => {});
                    });
                return false;
            } else {
                const result = await profileModel
                    .findOneAndUpdate(
                        {
                            userId: interaction.user.id,
                            serverId: interaction.guild.id,
                            "cooldowns.name": name,
                        },
                        {
                            $set: {
                                "cooldowns.$.value": Date.now(),
                            },
                        },
                        {
                            new: true,
                            upsert: true,
                        }
                    )
                    .catch(() => {});
                if (!result) {
                    await profileModel.findOneAndUpdate(
                        {
                            userId: interaction.user.id,
                            serverId: interaction.guild.id,
                        },
                        {
                            $push: {
                                cooldowns: {
                                    name: name,
                                    value: Date.now(),
                                },
                            },
                        }
                    );
                }
            }
        }
        return true;
    } catch (error) {
        console.log(`[HANDLE COOLDOWNS] ${error.stack}`);
        return false;
    }
};

module.exports = handleCooldowns;
