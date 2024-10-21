var colors = require(`colors`);
colors.enable();
const ProfileModel = require(`../models/profileSchema`);

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        if (member.user.bot) return;
        if (member.guild.id !== `1297850775707451402`) return;
        await ProfileModel.create({
            userId: member.id,
            guildId: member.guild.id,
        });
        console.log(`[GUILD MEMBER ADD] ${member.user.tag} joined the server`.green);
        const roles = await member.guild.roles.fetch();
        const roleId = "1297852220842442824";
        const role = roles.cache.get(roleId);
        if (!role) return;
        await member.roles.add(role);
        return;
    },
};
