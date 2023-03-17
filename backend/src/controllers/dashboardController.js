const TransactionModel = require('../models/TransactionModel');
const {CategoryModel} = require('../models/CategoryModel');
const {getWeekRange} = require('../utils/dateUtils');
const moment = require('moment');
const { default: mongoose } = require('mongoose');

const getBillsToReceive = async (req, res) =>{
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
    return res.status(200).json(billsToReceive);
}

module.exports = {
    getBillsToReceive
}