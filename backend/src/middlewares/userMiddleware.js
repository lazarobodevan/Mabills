const Joi = require('joi');

const validator = (schema, payload) => 
    schema.validate(payload, {abortEarly: false });

const userSignUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(45).required(),
    name: Joi.string().max(45).required()
});

const validateUserSignUp =(req, res, next)=>{
    const {error, value} = validator(userSignUpSchema, req.body);

    if(error){
        console.log(error);
        return res.status(400).json(error);
    }

    next();
};

module.exports = {
    validateUserSignUp
}