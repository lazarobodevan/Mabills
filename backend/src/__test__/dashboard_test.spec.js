const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {generateDefaultUser, loginDefaultUser, generateDefaultCategory, populateTransactions} = require('./utils/utils');

const {getBillsToReceive} = require('../controllers/dashboardController');

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

            await populateTransactions(token);

            const response = await request(app).get('/dashboard/weekcards').set({'Authorization':'bearer '+token});

            const expectation = {
                toReceive: { value: 10123, variation: -329.5 },
                toPay: { value: 40000, variation: -13101.3 },
                toExpire: { value: 246, variation: 80.3 }
              }

            expect(response.body).toMatchObject(expectation);
        })
    });
})
