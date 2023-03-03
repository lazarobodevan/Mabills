const Joi = require('joi');

const validator = (schema, payload) => 
     schema.validate(payload, {abortEarly: false });

const transactionSchema = Joi.object({
    name: Joi.string().required(),
    icon: Joi.string().required(),
});


const validateCategoryBody = (req, res, next) =>{
    const {error} = validator(transactionSchema, req.body);

    if(error){
        return res.status(400).json(error);
    }
    next();
}

module.exports = {
    validateCategoryBody
}