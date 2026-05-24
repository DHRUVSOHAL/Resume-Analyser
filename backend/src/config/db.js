const mongoose = require("mongoose");
require('dns').setDefaultResultOrder('ipv4first');

const MONGO_DB_URL = process.env.MONGO_DB_URL_ONLINE || process.env.MONGO_DB_URL_LOCAL;

const connectDB = () => {
    

    mongoose.connect(MONGO_DB_URL,{ family: 4 })
    .then(() => {
        console.log("Connected to MONGODB");
    })
    .catch((err) => {
        console.log("Error not connected to mongodb", err);
    });
};

module.exports = connectDB;