const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const blacklistModel =
    mongoose.models.Blacklist ||
    mongoose.model("Blacklist", blacklistSchema);

module.exports = blacklistModel;