var colors = require(`colors`);
colors.enable();

module.exports = {
    name: "error",
    async execute(error, client) {
        console.log(`[BOT] ${error.stack} ${new Date(Date.now())}`.red);
        return;
    },
};
