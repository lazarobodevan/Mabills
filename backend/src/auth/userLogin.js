require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const login = async (req, res) =>{
    const {email, password} = req.body;

    const user = await UserModel.findOne({email});

    if(!user){
        return res.status(401).json({message: "Incorrect email or password"});
    }
    const verifyPassword = await bcrypt.compare(password, user.password);

    if(!verifyPassword){
        return res.status(401).json({message: "Incorrect email or password"});
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_PASS, {expiresIn: '7d'});
    const userLogin = {
        id: user._id,
        name: user.name,
        email: user.email,
        ownCategories: user.ownCategories
    }
    
    return res.status(200).json({
        user: userLogin,
        token
    })
}

const getLoggedUser = async (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = {
    login,
    getLoggedUser
}