const TransactionModel = require('../models/TransactionModel');

const PAGINATION_LIMIT = 5;

const createTransaction = async(userId, transaction) =>{
    return await TransactionModel.create({
        userId,
        name: transaction.name,
        value:transaction.value,
        date: transaction.date,
        type:transaction.type,
        isPaid: transaction.isPaid,
        categoryId: transaction.categoryId
    });
}

const getTransactions = async(userId, query, offset, limit, baseUrl) =>{

    const {name, ...newQuery} = query;
    
    limit = Number(limit);
    offset = Number(offset);

    if(!limit){
        limit = PAGINATION_LIMIT;
    }

    if(!offset){
        offset = 0;
    }
    //console.log(query)
    const transactions = await TransactionModel.find(name ?
        {"name":{
                $regex: name,
                $options: "i"
            }
        }:{}
    ).where(newQuery)
        .populate('categoryId')
        .sort({date:-1})
        .skip(offset)
        .limit(limit)
        .then(transactions =>{return transactions;});

    const total = await TransactionModel.countDocuments({userId});
    const next = offset + limit;
    const currentUrl = baseUrl;

    const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}`:null;
    const previous = offset - limit < 0 ? null : offset-limit;
    const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}`: null;

    return{
        nextUrl,
        previousUrl,
        limit,
        offset,
        total,
        results:transactions
    }

}

const findByIdAndUpdate = async(id, transaction) =>{
    return await TransactionModel.findByIdAndUpdate(id, transaction, {new: true}).populate("categoryId");
}

const findByIdAndDelete = async(id)=>{
    return await TransactionModel.findByIdAndDelete(id);
}

module.exports={
    createTransaction,
    getTransactions,
    findByIdAndUpdate,
    findByIdAndDelete
}