const TransactionModel = require('../models/TransactionModel');
const {CategoryModel} = require('../models/CategoryModel');
const {getWeekRange} = require('../utils/dateUtils');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const { calcPercent } = require('../utils/mathUtils');

//Searches for INCOME bills to be received this week and returns total value
const getBillsToReceive = async (req, firstday, lastday) =>{
    let billsToReceive = await TransactionModel.aggregate([{
        $match:{
            $and:[
                {
                    userId: mongoose.Types.ObjectId(req.user._id)
                },
                {
                    date:{
                        $gte: firstday,
                        $lte: lastday
                    }
                },
                {
                    type: "INCOME"
                },

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

    return billsToReceive;
}

//Searches for bills to pay till the current week. It is considered a bill to pay since it is 
//5 days left to pay.
const getBillsToPay = async(req, firstDay, lastDay) =>{

    const billsToPay = await TransactionModel.aggregate([{
        $match:{
            $and:[
                {
                    userId: mongoose.Types.ObjectId(req.user._id)
                },
                {
                    type: 'EXPENSE'
                },
                {
                    isPaid: false
                },
                {
                    date:{
                        $gte: firstDay,
                        $lte: lastDay
                    }
                }
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

    return billsToPay;
}

const getBillsToExpire = async (req, firstDay, lastDay) =>{

    const billsToExpire =  await TransactionModel.aggregate([
        {
            $match:{
                $and:[
                    {
                        userId: req.user._id
                    },
                    {
                        type: 'EXPENSE'
                    },
                    {
                        isPaid: false
                    },
                    {
                        date:{
                            $gte: firstDay,
                            $lte: lastDay
                        }
                    }
                ]
            }
        },
        {
            $group:{
                _id: null,
                SUM:{
                    $sum: '$value'
                }
            }
        }
    ]);
    return billsToExpire;
}


const getWeekCards = async (req, res) =>{
    try{

        //------------------This week--------------------
        const lastDay = getWeekRange().lastday;
        const firstDay = getWeekRange().firstday;

        const lastDayMinusTwo = new Date(new Date(lastDay).setDate(lastDay.getDate() -2));

        const firstDayToExpire = new Date(new Date(firstDay).setDate(firstDay.getDate()+5));

        const toReceive =  await getBillsToReceive(req, firstDay, lastDay);
        const toPay = await getBillsToPay(req, firstDay, lastDayMinusTwo);
        const toExpire = await getBillsToExpire(req, firstDayToExpire, lastDay);


        //-----------------Last Week---------------------
        const pastLastDay = new Date(new Date(lastDay).setDate(lastDay.getDate() - 7));
        const pastFirstDay = new Date(new Date(firstDay).setDate(firstDay.getDate() - 7));

        const pastLastDayMinusTwo = new Date(new Date(pastLastDay).setDate(pastLastDay.getDate() -2));

        const pastFirstDayToExpire = new Date(new Date(pastFirstDay).setDate(pastFirstDay.getDate()+5));

        const pastToReceive =  await getBillsToReceive(req, pastFirstDay, pastLastDay);
        const pastToPay = await getBillsToPay(req, pastFirstDay, pastLastDayMinusTwo);
        const pastToExpire = await getBillsToExpire(req, pastFirstDayToExpire, pastLastDay);

        //---------------Generating payload--------------------

        const payload = {
            toReceive:{
                value: toReceive && toReceive[0] && toReceive[0].SUM || 0,
                variation: calcPercent(pastToReceive && pastToReceive[0] && pastToReceive[0].SUM || 0,
                     toReceive && toReceive[0] && toReceive[0].SUM || 0)
            },
            toPay:{
                value: toPay && toPay[0] && toPay[0].SUM || 0,
                variation: calcPercent(pastToPay && pastToPay[0] && pastToPay[0].SUM || 0, 
                    toPay && toPay[0] && toPay[0].SUM || 0)
            },
            toExpire:{
                value: toExpire && toExpire[0] && toExpire[0].SUM || 0,
                variation: calcPercent(pastToExpire && pastToExpire[0] && pastToExpire[0].SUM || 0, 
                    toExpire && toExpire[0] && toExpire[0].SUM || 0)
            }
        }

        return await res.status(200).json(payload);
    }catch(e){
        console.log(e)
        return res.status(400).json(e);
    }
}

const getWeekExpensesByCategory = async(req, res) =>{
    const expensesByCategory = await TransactionModel.aggregate([
        {
            $match:{
                $and:[
                    {
                        userId: mongoose.Types.ObjectId(req.user._id)
                    },
                    {
                        type:'EXPENSE'
                    },
                    {
                        date:{
                            $gte: getWeekRange().firstday,
                            $lte: getWeekRange().lastday
                        }
                    }   
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

    return res.status(200).json(expensesByCategory);
}

const getWeekIncomeByCategory = async(req, res) =>{
    const incomeByCategory = await TransactionModel.aggregate([
        {
            $match:{
                $and:[
                    {
                        userId: mongoose.Types.ObjectId(req.user._id)
                    },
                    {
                        type:'INCOME'
                    },
                    {
                        date:{
                            $gte: getWeekRange().firstday,
                            $lte: getWeekRange().lastday
                        }
                    }   
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
        },
    ]);
    
    return res.status(200).json(incomeByCategory);
}

module.exports = {
    getBillsToReceive,
    getBillsToPay,
    getBillsToExpire,
    getWeekCards,
    getWeekExpensesByCategory,
    getWeekIncomeByCategory
}