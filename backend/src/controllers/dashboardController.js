const TransactionModel = require('../models/TransactionModel');
const {CategoryModel} = require('../models/CategoryModel');
const {getWeekRange, getMonthRange, getYearRange} = require('../utils/dateUtils');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const { calcPercent } = require('../utils/mathUtils');

const dashboardDb = require('../database/dashboardDatabase');

//Searches for INCOME bills to be received this week and returns total value
const getBillsToReceive = async (req, firstday, lastday) =>{
    const {_id} = req.user;
    const filter = {
        type: 'INCOME'
    }
    return await dashboardDb.getTransactionsSumByType(firstday, lastday, _id, filter)
}

//Searches for bills to pay till the current week. It is considered a bill to pay since it is 
//5 days left to pay.
const getBillsToPay = async(req, firstday, lastday) =>{

    const {_id} = req.user;
    const filter = {
        type: 'EXPENSE',
        isPaid: false
    }
    return await dashboardDb.getTransactionsSumByType(firstday, lastday, _id, filter);

}

const getExpenses = async(req, firstday, lastday) =>{

    const {_id} = req.user;
    const filter = {
        type: 'EXPENSE'
    }
    return await dashboardDb.getTransactionsSumByType(firstday, lastday, _id, filter);
}

const getBillsToExpire = async (req, firstday, lastday) =>{

    const {_id} = req.user;
    const filter = {
        type: 'EXPENSE',
        isPaid: false
    }
    return await dashboardDb.getTransactionsSumByType(firstday, lastday, _id, filter);

}

const getExpiredBills = async (req, firstday, lastday) =>{

    const {_id} = req.user;
    const filter = {
        type: 'EXPENSE',
        isPaid: false,
        date:{
            $lt: moment.utc(new Date()).set({hour:0,minute:0,second:0,millisecond:0}).toDate(),
            $gte: firstday,
            $lte: lastday
        }
    }
    return await dashboardDb.getTransactionsSumByType(firstday, lastday, _id, filter);
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

    const {_id} = req.user;
    const filter = {
        date:{
            $gte: getWeekRange().firstday,
            $lte: getWeekRange().lastday
        },
        type:'EXPENSE'
    }
    const expensesByCategory = await dashboardDb.getTransactionsWithCategoryInfo(_id, filter);

    return res.status(200).json(expensesByCategory);
}
const getMonthExpensesByCategory = async(req, res) =>{

    const {_id} = req.user;
    const filter = {
        date:{
            $gte: getMonthRange().firstday,
            $lte: getMonthRange().lastday
        },
        type:'EXPENSE'
    }
    const expensesByCategory = await dashboardDb.getTransactionsWithCategoryInfo(_id, filter);

    return res.status(200).json(expensesByCategory);
}

const getWeekIncomeByCategory = async(req, res) =>{

    const {_id} = req.user;
    const filter = {
        date:{
            $gte: getWeekRange().firstday,
            $lte: getWeekRange().lastday
        },
        type:'INCOME'
    }
    const expensesByCategory = await dashboardDb.getTransactionsWithCategoryInfo(_id, filter);

    return res.status(200).json(expensesByCategory);

}
const getMonthIncomeByCategory = async(req, res) =>{

    const {_id} = req.user;
    const filter = {
        date:{
            $gte: getMonthRange().firstday,
            $lte: getMonthRange().lastday
        },
        type:'INCOME'
    }
    const expensesByCategory = await dashboardDb.getTransactionsWithCategoryInfo(_id, filter);

    return res.status(200).json(expensesByCategory);

}

const getDashboardCards = async(req, res) =>{
    try{

        //------------------This Month--------------------
        const lastDay = getMonthRange().lastday;
        const firstDay = getMonthRange().firstday;

        const incomes =  await getBillsToReceive(req, firstDay, lastDay);
        const expenses = await getExpenses(req, firstDay, lastDay);
        const expired = await getExpiredBills(req, firstDay, lastDay);

        //------------------Last Month--------------------
        const pastLastDay = moment.utc(getMonthRange().lastday).subtract(1,'months').endOf('month').toDate();
        const pastFirstDay = moment.utc(getMonthRange().firstday).subtract(1,'months').startOf('month').toDate();

        const pastIncomes =  await getBillsToReceive(req, pastFirstDay, pastLastDay);
        const pastExpenses = await getExpenses(req, pastFirstDay, pastLastDay);
        const pastExpired = await getExpiredBills(req, pastFirstDay, pastLastDay);

        //---------------Generating payload--------------------

        const payload = {
            incomes:{
                value: incomes && incomes[0] && incomes[0].SUM || 0,
                variation: calcPercent(pastIncomes && pastIncomes[0] && pastIncomes[0].SUM || 0,
                    incomes && incomes[0] && incomes[0].SUM || 0)
            },
            expenses:{
                value: expenses && expenses[0] && expenses[0].SUM || 0,
                variation: calcPercent(pastExpenses && pastExpenses[0] && pastExpenses[0].SUM || 0, 
                    expenses && expenses[0] && expenses[0].SUM || 0)
            },
            expired:{
                value: expired && expired[0] && expired[0].SUM || 0,
                variation: calcPercent(pastExpired && pastExpired[0] && pastExpired[0].SUM || 0, 
                    expired && expired[0] && expired[0].SUM || 0)
            }
        }

        return await res.status(200).json(payload);
    }catch(e){
        console.log(e)
        return res.status(400).json(e);
    }
}

const getYearIncomesExpenses = async (req, res) =>{
    try{

        const {_id} = req.user;
        
        const date = {
            $gte: getYearRange().firstday,
            $lte: getYearRange().lastday
        }
        
        const yearIncomesExpenses = dashboardDb.getYearTransactions(_id, date);

        return res.status(200).json(yearIncomesExpenses);

    }catch(e){
        console.log(e);
        return res.status(400).json(e);
    }
}

module.exports = {
    getBillsToReceive,
    getBillsToPay,
    getBillsToExpire,
    getWeekCards,
    getWeekExpensesByCategory,
    getWeekIncomeByCategory,
    getDashboardCards,
    getMonthIncomeByCategory,
    getMonthExpensesByCategory,
    getYearIncomesExpenses
}