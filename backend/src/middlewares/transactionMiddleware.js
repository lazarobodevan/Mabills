const Joi = require('joi');
const moment = require('moment');

const validator = (schema, payload) => 
     schema.validate(payload, {abortEarly: false });

const incomeTransactionSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().required(),
    date: Joi.date().required(),
    type: Joi.string().valid("INCOME").valid("EXPENSE"),
    categoryId: Joi.string().required()
});

const expenseTransactionSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.number().required(),
    date: Joi.date().required(),
    type: Joi.string().valid("INCOME").valid("EXPENSE"),
    isPaid: Joi.boolean().required(),
    categoryId: Joi.string().required()
});

const filterSchema = Joi.object({
    category: Joi.string().optional(),
    value: Joi.number().optional(),
    date: Joi.date().optional(),
    type: Joi.string().valid('INCOME').valid('EXPENSE')
})

const validateTransactionBody = (req, res, next) =>{
    let newReq = req.body;
    newReq.date = new Date(moment(newReq.date,'DD-MM-YYYY').format('YYYY-MM-DD'));

    if(newReq.type === 'INCOME'){
        const {error} = validator(incomeTransactionSchema, newReq);
        if(error){
            return res.status(400).json(error);
        }
    }else{
        const {error} = validator(expenseTransactionSchema, newReq);
        if(error){
            return res.status(400).json(error);
        }
    }
    next();
}

const validateFilterBody = (req, res, next) =>{
    let newReq = req.body;
    if(newReq.date)
        newReq.date = new Date(moment(newReq.date,'DD-MM-YYYY').format('YYYY-MM-DD'));

    const {error} = validator(filterSchema, newReq);

    if(error){
        return res.status(400).json(error);
    }
    next();
}

module.exports = {
    validateTransactionBody,
    validateFilterBody
}