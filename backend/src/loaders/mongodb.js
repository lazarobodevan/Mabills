const mongoose = require('mongoose');
require('dotenv').config();
if(process.env.NODE_ENV === "DEV")
    require('dotenv').config({path: `DEV.env`});
else
    require('dotenv').config({path: `PRD.env`});

async function startDB(){
    console.log("Connecting to mongo... "+process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'PRD')
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER_PRD}:${process.env.DB_PASSWORD_PRD}@${process.env.DB_CLUSTER_PRD}.${process.env.DB_KEY_PRD}.mongodb.net/${process.env.DB_NAME_PRD}`);
    else
        await mongoose.connect(`mongodb://0.0.0.0:${process.env.PORT_DEV}/${process.env.DB_NAME_DEV}`);

    console.log("Connected to mongo!");
}

module.exports = startDB;