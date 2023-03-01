require('dotenv').config();

const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const validateUserLoggedIn = async (req, res, next) =>{
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(403).json({message: "Access denied"});
    }

    const token = authorization.split(' ')[1];

    const {id} = jwt.verify(token, process.env.JWT_PASS);

    const user = await UserModel.findById(id).then(obj => {return obj;});

    if(!user){
        return res.status(403).json({message: "Access denied"});
    }

    const loggedUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        transactions: [user.transactions],
        ownCategories: [user.ownCategories]
    }

    user.password = "";

    req.user = user;
    next();
}

module.exports = {
    validateUserLoggedIn
}