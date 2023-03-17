const UserModel = require("../../models/UserModel")
const request = require('supertest');

const app = require('../../app');
const TransactionModel = require("../../models/TransactionModel");

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

const populateTransactions = async(token) =>{
    const categoryCreated = await generateDefaultCategory(token);

    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value:123,
        date: "16/03/2023",
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:10000,
        date: "16/03/2023",
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:40000,
        date: "16/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:0,
        date: "16/03/2023",
        type: "EXPENSE",
        isPaid: true,
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:123,
        date: "17/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });

    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:123,
        date: "18/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });

    //-----------------PAST WEEK-------------------------
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction",
        value:1123,
        date: "06/03/2023",
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:1234,
        date: "07/03/2023",
        type: "INCOME",
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:303,
        date: "09/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:12,
        date: "10/03/2023",
        type: "EXPENSE",
        isPaid: true,
        categoryId: categoryCreated._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:12,
        date: "11/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });

    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:1234,
        date: "11/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: categoryCreated._id,
    });
}

const populateTransactions2 = async (token) =>{
    const newCat = await request(app).post('/category').set({'Authorization':'bearer '+token}).send({
        name: "test",
        icon:"testicon.png"
    });

    const cat = newCat.body;
    //await populateTransactions(token);
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:10000,
        date: "16/03/2023",
        type: "INCOME",
        categoryId: cat._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:40000,
        date: "16/03/2023",
        type: "EXPENSE",
        isPaid: false,
        categoryId: cat._id,
    });
    await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
        name: "transaction2",
        value:0,
        date: "16/03/2023",
        type: "EXPENSE",
        isPaid: true,
        categoryId: cat._id,
    });
}

module.exports = {
    generateDefaultUser,
    loginDefaultUser,
    generateDefaultCategory,
    populateTransactions,
    populateTransactions2
}