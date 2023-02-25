require('dotenv').config();
const mongoose = require('mongoose');

async function startDB(){
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.pdbawvz.mongodb.net/test`);
}

module.exports = startDB;