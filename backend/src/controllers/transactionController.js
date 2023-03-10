const transactionModel = require('../models/TransactionModel');
const moment = require('moment');
const TransactionModel = require('../models/TransactionModel');
const {CategoryModel} = require('../models/CategoryModel');

const createTransaction = async (req, res) =>{
    const {name, value, date, type, categoryId} = req.body;
    const loggedUser = req.user;

    try{
        const category = await CategoryModel.findOne({userId: loggedUser._id, _id: categoryId}).then((category => {return category;}))
        if(!category){
            return res.status(400).json({message: "Invalid category"});
        }
        let newTransaction = await transactionModel.create({
            userId: loggedUser._id,
            name,
            value,
            date: date,
            type,
            categoryId
        });
        
        return res.status(200).json({newTransaction, category});
        
    }catch(e){
        console.log(e)
        return res.status(500).json({message: "Internal server error"});
    }

}

const getTransactions = async(req, res) =>{

    let {limit, offset} = req.query;
    const {date, value, category, type} = req.body;

    const {user} = req;

    const filter = {
        userId: user._id,
        date: date ? moment(moment(date,'DD-MM-YYYY').format('YYYY-MM-DD')).utc().format(): null,
        value,
        category,
        type
    }

    const query = buildFilter(filter);

    limit = Number(limit);
    offset = Number(offset);

    if(!limit){
        limit = 5;
    }

    if(!offset){
        offset = 0;
    }

    
    const transactions = await (await transactionModel.find(query)
                                                        .populate("categoryId")
                                                        .sort({date:-1})
                                                        .skip(offset)
                                                        .limit(limit)
                                                        .then(transactions =>{return transactions;}));

    const total = await TransactionModel.countDocuments({userId: user._id});
    const next = offset + limit;
    const currentUrl = req.baseUrl;

    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}`:null;
    const previous = offset - limit < 0 ? null : offset-limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}`: null;

    return res.status(200).json({
        nextUrl,
        previousUrl,
        limit,
        offset,
        total,
        results:transactions
    });
}

const updateTransaction = async(req, res) => {

    //TODO: talvez validar se a transa????o pertence ao usu??rio.

    try{
        const id = req.params.id;
        const updatedTransaction = await transactionModel.findByIdAndUpdate(id, req.body, {new: true}).populate("categoryId");
        return res.status(200).json(updatedTransaction);

    }catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteTransaction = async(req, res) => {
    
    //TODO: talvez validar se a transa????o pertence ao usu??rio.
    
    try{
        const {id} = req.params;
        await transactionModel.findByIdAndDelete(id);
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
    return query;
}

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction
}