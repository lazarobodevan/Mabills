const TransactionModel = require('../models/TransactionModel');
const {CategoryModel} = require('../models/CategoryModel');
const {getWeekRange} = require('../utils/dateUtils');
const moment = require('moment');
const { default: mongoose } = require('mongoose');

//Searches for INCOME bills to be received this week and returns total value
const getBillsToReceive = async (req) =>{
    const billsToReceive = await TransactionModel.aggregate([{
        $match:{
            $and:[
                {
                    userId: mongoose.Types.ObjectId(req.user._id)
                },
                {
                    date:{
                        $gte: getWeekRange().firstday,
                        $lte: getWeekRange().lastday
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
const getBillsToPay = async(req) =>{
    
    const lastDay = getWeekRange().lastday;
    const lastDayMinusTwo = new Date(lastDay.setDate(lastDay.getDate() -2));

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
                        $gte: getWeekRange().firstday,
                        $lte: lastDayMinusTwo
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

    return billsToPay;
}

const getBillsToExpire = async (req) =>{

    const firstDay = getWeekRange().firstday;
    const firstDayToExpire = new Date(firstDay.setDate(firstDay.getDate()+5))

    return await TransactionModel.aggregate([
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
                            $gte: firstDayToExpire,
                            $lte: getWeekRange().lastday
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
    ])
}

const getWeekCards = async (req, res) =>{
    try{
        const toPay = await getBillsToPay(req);
        const toReceive =  await getBillsToReceive(req);
        const toExpire = await getBillsToExpire(req);

        return res.status(200).json({
            toPay,
            toReceive,
            toExpire
        });
    }catch(e){
        return res.status(400).json(e);
    }
}

module.exports = {
    getBillsToReceive,
    getBillsToPay,
    getBillsToExpire,
    getWeekCards
}