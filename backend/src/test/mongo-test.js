require('dotenv').config();
const mongoose = require('mongoose');

async function startDB(){
    console.log("Connecting to mongo test...");
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER_TEST}:${process.env.DB_PASSWORD_TEST}@${process.env.DB_CLUSTER_TEST}.lrkgbdj.mongodb.net/test`);
    console.log("Connected to mongo!");
}

module.exports = startDB;