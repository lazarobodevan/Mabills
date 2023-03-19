const request = require('supertest');
const moment = require('moment');

const app = require('../../app');
const { getWeekRange } = require("../../utils/dateUtils");

const THIS_WEEK_FIRST_DAY = getWeekRange().firstday;
const THIS_WEEK_LAST_DAY  = getWeekRange().lastday;
const THIS_WEEK_LAST_DAY_TO_BE_PAID = moment.utc(new Date(THIS_WEEK_LAST_DAY).setDate(THIS_WEEK_LAST_DAY.getDate() - 2)).format('DD/MM/YYYY');
const THIS_WEEK_FIRST_DAY_TO_EXPIRE = moment.utc(new Date(THIS_WEEK_LAST_DAY).setDate(THIS_WEEK_LAST_DAY.getDate() - 1)).format('DD/MM/YYYY');
const THIS_WEEK_LAST_DAY_TO_EXPIRE = moment.utc(THIS_WEEK_LAST_DAY).format('DD/MM/YYYY');

const LAST_WEEK_FIRST_DAY = new Date(new Date(THIS_WEEK_FIRST_DAY).setDate(THIS_WEEK_FIRST_DAY.getDate() - 6));
const LAST_WEEK_LAST_DAY  = new Date(new Date(THIS_WEEK_LAST_DAY).setDate(THIS_WEEK_LAST_DAY.getDate() - 6));
const LAST_WEEK_LAST_DAY_TO_BE_PAID = moment(new Date(LAST_WEEK_LAST_DAY).setDate(LAST_WEEK_LAST_DAY.getDate() - 2)).format('DD/MM/YYYY');
const LAST_WEEK_FIRST_DAY_TO_EXPIRE = moment(new Date(LAST_WEEK_LAST_DAY).setDate(LAST_WEEK_LAST_DAY.getDate() - 1)).format('DD/MM/YYYY');
const LAST_WEEK_LAST_DAY_TO_EXPIRE = moment(LAST_WEEK_LAST_DAY).format('DD/MM/YYYY');

const generateDefaultUser = async() => {
    const response = await request(app).post('/signup').send({
        email:'default@default.com',
        password:'123',
        name: 'default'
    });
    return response.body;
}

const loginDefaultUser = async () =>{
    const response = await request(app).post('/signin').send({
        email: 'default@default.com',
        password: '123'
    });

    return response.body.token;
}

const generateDefaultCategory = async (token) =>{
    const response = await request(app).post('/category').set({'Authorization':'bearer '+token}).send({
        name: "defaultCategory",
        icon:"defaultCategory.png"
    });

    return response.body;
}

const generateCategory = async(token, name) => {
    const response = await request(app).post('/category').set({'Authorization':'bearer '+token}).send({
        name: name,
        icon:"defaultCategory.png"
    });

    return response.body;
}

const populateThisWeekIncome = async(token, categoryCreated, value)=>{

    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_BE_PAID,
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_BE_PAID,
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
}

const populateThisWeekToBePaid = async(token, categoryCreated, value)=>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_BE_PAID,
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_BE_PAID,
        type: "EXPENSE",
        isPaid: true,
        categoryId: categoryCreated._id,
    });
}

const populateThisWeekToExpire = async (token, categoryCreated, value) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: THIS_WEEK_FIRST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });

    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
}

const populateLastWeekIncome = async(token, categoryCreated, value) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: LAST_WEEK_FIRST_DAY,
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: LAST_WEEK_FIRST_DAY,
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
}

const populateLastWeekToBePaid = async(token, categoryCreated, value) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: LAST_WEEK_LAST_DAY_TO_BE_PAID,
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: LAST_WEEK_FIRST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: true,
        categoryId: categoryCreated._id,
    });
}

const populateLastWeekToExpire = async(token, categoryCreated, value) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: LAST_WEEK_LAST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });

    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value: value,
        date: LAST_WEEK_LAST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
}

const populateTransactions = async(token, cat) =>{
    await populateThisWeekIncome(token, cat, 1);
    await populateThisWeekToBePaid(token, cat, 2);
    await populateThisWeekToExpire(token, cat, 3);
    
    await populateLastWeekIncome(token, cat, 3);
    await populateLastWeekToBePaid(token, cat, 1);
    await populateLastWeekToExpire(token, cat, 2);
    
}

module.exports = {
    generateDefaultUser,
    loginDefaultUser,
    generateDefaultCategory,
    generateCategory,
    populateTransactions,
}