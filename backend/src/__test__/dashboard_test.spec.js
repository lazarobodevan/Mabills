const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {
    generateDefaultUser, 
    loginDefaultUser, 
    generateDefaultCategory, 
    generateCategory, 
    populateTransactions} = require('./utils/utils');

const {getBillsToReceive} = require('../controllers/dashboardController');
const TransactionModel = require('../models/TransactionModel');

let token;
let categoryCreated;
let transactionCreated;

beforeAll(async ()=>{
    await mongo.connect();
    user = await generateDefaultUser();
    token = await loginDefaultUser();
    categoryCreated = await generateDefaultCategory(token);
});

afterAll(async ()=>{
    await mongo.clearDatabase();
    await mongo.closeDatabase();
})

describe('Dashboard domain',() => {
    describe('GET #getWeekCards', ()=>{
        it('should get total value and variation from this week to the last one of bills to receive, bills to pay and late bills', async()=>{
            await populateTransactions(token, categoryCreated);
            
            const response = await request(app).get('/dashboard/weekcards').set({'Authorization':'bearer '+token});
            console.log(response.body);
            const expectation = {
                toReceive: { value: 2, variation: 0 },
                toPay: { value: 2, variation: 100 },
                toExpire: { value: 6, variation: 50 }
              }

            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('GET #getWeekExpenses', ()=>{
        it('should get total expenses by category from the current week', async()=>{

            const cat1 = await generateCategory(token, 'cat1');
            await populateTransactions(token, cat1);
            
            const response = await request(app).get('/dashboard/expenses-by-category-week').set({'Authorization':'bearer '+token});
            console.log(response.body);
            const expectation = [
                { _id: { name: 'defaultCategory', color: '#FFFFFF' }, SUM: 10 },
                { _id: { name: 'cat1', color: '#FFFFFF' }, SUM: 10 }
              ]

              expect(response.body).toEqual(
                expect.arrayContaining(expectation)
              );
        })
    });

    describe('GET #getWeekIncome', ()=>{
        it('should get total income by category from the current week', async()=>{

            const response = await request(app).get('/dashboard/incomes-by-category-week').set({'Authorization':'bearer '+token});
            console.log(response.body);
            const expectation = [
                { _id: { name: 'defaultCategory', color: '#FFFFFF' }, SUM: 2 },
                { _id: { name: 'cat1', color: '#FFFFFF' }, SUM: 2 }
              ]

              expect(response.body).toEqual(
                expect.arrayContaining(expectation)
              );
        })
    });
})
