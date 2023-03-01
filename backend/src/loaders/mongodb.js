require('dotenv').config();
const mongoose = require('mongoose');

async function startDB(){
    console.log("Connecting to mongo...");
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.pdbawvz.mongodb.net/test`);
    console.log("Connected to mongo!");
}

module.exports = startDB;