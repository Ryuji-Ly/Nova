const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    cooldowns: {
        type: Array,
        default: [],
    },
});

const model = mongoose.model("user", profileSchema);

module.exports = model;
