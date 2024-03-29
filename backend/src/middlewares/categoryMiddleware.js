const Joi = require('joi');
const { getMessagesFromJoiError } = require('../utils/errorUtils');

const validator = (schema, payload) => 
     schema.validate(payload, {abortEarly: false });

const transactionSchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().required()
});


const validateCategoryBody = (req, res, next) =>{
    const {error} = validator(transactionSchema, req.body);

    if(error){
        return res.status(400).json(getMessagesFromJoiError(error));
    }
    next();
}

const validateParams = (req, res, next) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message: 'Param Id is required'});
    }
    next();
}

module.exports = {
    validateCategoryBody,
    validateParams
}