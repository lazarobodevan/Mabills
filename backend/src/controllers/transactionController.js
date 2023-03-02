const transactionModel = require('../models/TransactionModel');
const {CategoryModel} = require('../models/CategoryModel');
const moment = require('moment');

const createTransaction = async (req, res) =>{
    const {name, value, date, type, categoryId} = req.body;
    const loggedUser = req.user;
    try{
        const category = await CategoryModel.findOne({userId: loggedUser._id, _id: categoryId}).then((category => {return category;}))
        const newTransaction = await transactionModel.create({
            userId: loggedUser._id,
            name,
            value,
            date: moment(date,'YYYY-MM-DD').format(),
            type,
            category
        });

        return res.status(200).json(newTransaction);
        
    }catch(e){
        console.log(e)
        return res.status(500).json({message: "Internal server error"});
    }

}

const getTransactions = async(req, res) =>{
    const {user} = req;
    const transactions = await transactionModel.find({userId: user._id}).then(transactions =>{return transactions;});

    return res.status(200).json(transactions);
}

module.exports = {
    createTransaction,
    getTransactions
}