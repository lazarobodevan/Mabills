
require('dotenv').config();
if(process.env.NODE_ENV === "DEV")
    require('dotenv').config({path: `DEV.env`});
else
    require('dotenv').config({path: `PRD.env`});

const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const validateUserLoggedIn = async (req, res, next) =>{
    const {authorization} = req.headers;

    try{
        if(!authorization){
            return res.status(403).json({message: "Access denied"});
        }
    
        const token = authorization.split(' ')[1];
    
        const {id} = jwt.verify(token, process.env.JWT_PASS);
    
        const user = await UserModel.findById(id).then(obj => {return obj;});
    
        if(!user){
            return res.status(403).json({message: "Access denied"});
        }
    
        user.password = "";
    
        req.user = user;
        next();

    }catch(e){
        console.log(e);
        return res.status(403).json({message: "Access denied"});
    }
}

module.exports = {
    validateUserLoggedIn
}