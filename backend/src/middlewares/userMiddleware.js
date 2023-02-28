const Joi = require('joi');

const validator = (schema, payload) => 
    schema.validate(payload, {abortEarly: false });

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().max(45).required(),
    name: Joi.string().max(45).required()
});

const validateUser =(req, res, next)=>{
    const {error, value} = validator(userSchema, req.body);

    if(error){
        console.log(error);
        return res.status(400).json(error);
    }

    next();
};



module.exports = {
    validateUser
}