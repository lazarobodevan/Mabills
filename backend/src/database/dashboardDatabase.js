const TransactionModel = require('../models/TransactionModel');
const { default: mongoose } = require('mongoose');

const getTransactionsSumByType = async (firstday, lastday, userId, filter) =>{
    return await TransactionModel.aggregate([{
        $match:{
            $and:[
                {
                    userId: mongoose.Types.ObjectId(userId)
                },
                {
                    date:{
                        $gte: firstday,
                        $lte: lastday
                    }
                },
                
                filter,

            ]
            }
    },
    {
        $group:{
            _id:null,
            SUM:{
                $sum: '$value'
            }
        }
    }

    ]);
}

const getTransactionsWithCategoryInfo = async (userId, filter)=>{
    return await TransactionModel.aggregate([
        {
            $match:{
                $and:[
                    {
                        userId: mongoose.Types.ObjectId(userId)
                    },
                    
                    filter,   
                ]
            }
        },
        {
            $lookup:{
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'categoryDetails'

            }
        },
        {
            $unwind: '$categoryDetails'
        },
        {
            $group:{
                _id:{
                    name: '$categoryDetails.name',
                    color:'$categoryDetails.color',
                },
                SUM:{
                    $sum:'$value'
                }
            }
        }
    ]);
}

const getYearTransactions = async(userId, date) =>{
    return await TransactionModel.aggregate([
        {
            $match:{
                $and:[
                    {
                        userId: mongoose.Types.ObjectId(userId)
                    },
                    {
                        date
                    }   
                ]
            }
        },
        {
            $group:{
                _id:{
                    month:{ $arrayElemAt:[
                        ['','Janeiro','Fevereiro','Março','Abril','Maio', 'Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
                        {$month:{$toDate: "$date"}}
                    ] ,
                }},
               
                INCOME: {$sum: {
                    $cond:[
                        {
                            $eq:['$type', "INCOME"]
                        },
                        "$value",
                        0
                    ]
                }},
                EXPENSE: {$sum: {
                    $cond:[
                        {
                            $eq:['$type', "EXPENSE"]
                        },
                        "$value",
                        0
                    ]
                }},
                
            },
            
        },
    ]);
}

module.exports = {
    getTransactionsSumByType,
    getTransactionsWithCategoryInfo,
    getYearTransactions
}