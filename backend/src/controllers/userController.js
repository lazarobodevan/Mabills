const userModel = require('../models/UserModel');
const express = require('express');

const app = express();

const createUser = async (req, res) =>{
    console.log(req.body);
    const createdUser = await userModel.create(req.body);

    return res.status(200).json(createdUser);
}


module.exports = {
    createUser,
}