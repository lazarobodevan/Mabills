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
    return response;
}

const loginDefaultUser = async () =>{
    return await request(app).post('/signin').send({
        email: 'default@default.com',
        password: '123'
    });

}

const signUp = async(name, email, password) =>{
    return await request(app).post('/signup').send({
        email: email,
        name: name,
        password: password
    });
}

const signIn = async (email, password) =>{
    const response = await request(app).post('/signin').send({
        email,
        password
    });

    return response;
}

const updateUser = async(email, name, password, token) =>{
    return await request(app).put('/users').set({'Authorization':'bearer '+token}).send({
        email,
        name,
        password
    });
}


const generateCategory = async(token, name) => {
    const response = await request(app).post('/category').set({'Authorization':'bearer '+token}).send({
        name: name,
        color: '#FFFFFF'
    });

    return response.body;
}

const addThisWeekIncome = async(token, value, category) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_BE_PAID,
        type: "INCOME",
        categoryId: category._id,
    });
}

const addThisWeekToBePaid = async (token, value, category) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: THIS_WEEK_LAST_DAY_TO_BE_PAID,
        type: "EXPENSE",
        isPaid: false,
        categoryId: category._id,
    });
}

const addThisWeekToExpire = async (token, value, category)=>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: THIS_WEEK_FIRST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: false,
        categoryId: category._id,
    });
}
const addLastWeekIncome = async(token, value, category) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: LAST_WEEK_LAST_DAY_TO_BE_PAID,
        type: "INCOME",
        categoryId: category._id,
    });
}

const addLastWeekToBePaid = async (token, value, category) =>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: LAST_WEEK_LAST_DAY_TO_BE_PAID,
        type: "EXPENSE",
        isPaid: false,
        categoryId: category._id,
    });
}

const addLastWeekToExpire = async (token, value, category)=>{
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value: value,
        date: LAST_WEEK_FIRST_DAY_TO_EXPIRE,
        type: "EXPENSE",
        isPaid: false,
        categoryId: category._id,
    });
}

module.exports = {
    generateDefaultUser,
    loginDefaultUser,
    signUp,
    signIn,
    updateUser,
    generateCategory,
    addThisWeekIncome,
    addThisWeekToBePaid,
    addThisWeekToExpire,
    addLastWeekIncome,
    addLastWeekToBePaid,
    addLastWeekToExpire
}