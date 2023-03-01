const UserModel = require("../models/UserModel");
const moment = require('moment');

const createTransaction = async (req, res) =>{
    const {name, value, date, type} = req.body;
    const userModel = req.user;

    userModel.transactions.push({
        name,
        value,
        date: moment(date,'YYYY-MM-DD').format(),
        type
    });

    try{
        userModel.save();
        return res.status(200).json(userModel.transactions);
        
    }catch(e){
        console.log(e)
        return res.status(500).json({message: "Internal server error"});
    }

}

const getTransactions = async(req, res) =>{
    const {user} = req;
    const transactions = UserModel.findById(user.id);

    return res.status(200).json(transactions);
}

module.exports = {
    createTransaction,
    getTransactions
}