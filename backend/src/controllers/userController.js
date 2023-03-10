const userModel = require('../models/UserModel');
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

const createUser = async (req, res) =>{

    const {password, name, email} = req.body;
    const hashPassword = await encryptPassoword(password);

    const newUser = await userModel.create({
        name, 
        email,
        password: hashPassword
    });

    newUser.password = "";
    //const {password: _, ...user} = newUser;

    return res.status(200).json(newUser);
}

const updateUser = async (req, res) =>{

    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, req.body, {new: true});

    updatedUser.password = "";
    req.user = updatedUser;

    return res.status(201).json(updatedUser);
}

const encryptPassoword = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hash(password, salt).then((hash)=>{
        return hash;
    });
    return hashed;
}

module.exports = {
    createUser,
    updateUser
}