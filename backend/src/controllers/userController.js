const userModel = require('../models/UserModel');
const express = require('express');

const app = express();

const createUser = async (req, res) =>{
    const createdUser = await userModel.create(req.body);

    return res.status(200).json(createdUser);
}

const updateUser = async (req, res) =>{
    const updatedUser = await userModel.updateOne(req.body);

    return res.status(201).json(updatedUser);
}

module.exports = {
    createUser,
    updateUser
}