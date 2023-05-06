const moment = require('moment');
const categoryDb = require('../database/categoryDatabase');
const transactionDb = require('../database/transactionDatabase');

const createTransaction = async (req, res) =>{
    const {name, value, date, type, isPaid, categoryId} = req.body;
    const {_id} = req.user;

    try{
        const category = await categoryDb.findById(_id, categoryId);
        if(!category){
            return res.status(400).json({message: "Invalid category"});
        }
        let newTransaction = await transactionDb.createTransaction(_id, req.body);
        
        return res.status(200).json({newTransaction, category});
        
    }catch(e){
        console.log(e)
        return res.status(500).json({message: "Internal server error"});
    }

}

const getTransactions = async(req, res) =>{
    try{
        const {date, value, categoryId, type, isPaid, name} = req.body;
        let {limit, offset} = req.query;
        const {_id} = req.user;


        const query = buildFilter(
            {
                userId: _id,
                date: date ? new Date(moment.utc(date,'DD-MM-YYYY').format('YYYY-MM-DD')): null,
                value,
                categoryId,
                isPaid,
                type,
                name
            }
        );

        const transactions = await transactionDb.getTransactions(_id, query, offset, limit, req.baseUrl);
        
        return res.status(200).json(transactions);
    }catch(e){
        console.log(e);
    }
}

const updateTransaction = async(req, res) => {

    //TODO: talvez validar se a transação pertence ao usuário.

    try{
        const id = req.params.id;
        const updatedTransaction = await transactionDb.findByIdAndUpdate(id, req.body);
        return res.status(200).json(updatedTransaction);

    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteTransaction = async(req, res) => {
    
    //TODO: talvez validar se a transação pertence ao usuário.
    
    try{
        const {id} = req.params;
        await transactionDb.findByIdAndDelete(id);
        return res.status(202).json({message: "Object deleted"});
    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

buildFilter = (filter) => {
    
    let query = {};

    for(let key in filter){
        if(filter[key]){
            query[key] = filter[key];
        }
    }
    query['userId'] = filter.userId;
    console.log(query)
    return query;
}

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
}