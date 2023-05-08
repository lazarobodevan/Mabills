const userDb = require('../database/userDatabase');
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

const createUser = async (req, res) =>{

    const {password, name, email} = req.body;
    const hashPassword = await encryptPassoword(password);

    const newUser = await userDb.createUser(name, email, hashPassword);

    newUser.password = "";

    return res.status(200).json(newUser);
}

const updateUser = async (req, res) =>{

    const {name, email, password} = req.body;
    const hashedPassword = await encryptPassoword(password);
    const updatedUser = await userDb.findByIdAndUpdate(req.user._id, name, email, hashedPassword);

    updatedUser.password = "";
    req.user = updatedUser;

    return res.status(201).json(updatedUser);
}

const deleteUser = async (req, res) =>{
    try{
        const {id} = req.params;

        await userDb.findByIdAndDelete(id);

        return await res.status(201).json({message:'User deleted'});
    }catch(e){
        return await res.status(401).json({message: 'Error while deleting user'})
    }
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
    updateUser,
    deleteUser
}