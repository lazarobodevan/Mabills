const Joi = require('joi');
const moment = require('moment');

const validator = (schema, payload) => 
     schema.validate(payload, {abortEarly: false });

const transactionSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().required(),
    date: Joi.date().required(),
    type: Joi.string().valid("INCOME").valid("EXPENSE"),
    categoryId: Joi.string().required()
});

const validateTransactionBody = (req, res, next) =>{
    const newReq = req.body;
    newReq.date = moment(req.body.date, 'YYYY-MM-DD').format()
    const {error} = validator(transactionSchema, newReq);

    if(error){
        return res.status(400).json(error);
    }

    next();
}

module.exports = {
    validateTransactionBody
}