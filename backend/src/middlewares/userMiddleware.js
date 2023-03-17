const Joi = require('joi');
const UserModel = require('../models/UserModel');

const validator = (schema, payload) => 
     schema.validate(payload, {abortEarly: false });

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().max(45).required()
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const validateUserBody = async (req, res, next)=>{
    const {error, value} = validator(userSchema, req.body);

    if(error){
        return res.status(400).json(error);
    }

    next();
};

const validateUserAlreadyExists = async(req, res, next) =>{
    const {email} = req.body;

    const userExists = await UserModel.findOne({email});

    if(userExists){
        return res.status(400).json({message:"User already exists"});
    }

    next();
}

const validateLoginBody = (req, res, next) =>{
    const {error, value} = validator(userLoginSchema, req.body);

    if(error){
        console.log(error);
        return res.status(400).json(error);
    }

    next();
}

const validateEmailAreadyInUse = async (req, res, next) =>{
    const {email} = req.body;
    const {user} = req;

    
    if(email != user.email){
        const foundUser = await UserModel.findOne({email}).then(user => {return user;});
        if(foundUser){
            return res.status(400).json({message: "Email already in use"});
        }
        next();
    }
    next();
}


module.exports = {
    validateUserBody,
    validateUserAlreadyExists,
    validateLoginBody,
    validateEmailAreadyInUse
}