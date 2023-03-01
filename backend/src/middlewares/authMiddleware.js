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

    const user = await UserModel.findById(id);

    if(!user){
        return res.status(403).json({message: "Access denied"});
    }

    const loggedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        transactions: user.transactions,
        ownCategories: user.ownCategories
    }

    req.user = loggedUser;
    next();
}

module.exports = {
    validateUserLoggedIn
}