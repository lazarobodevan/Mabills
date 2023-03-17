const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {generateDefaultUser, loginDefaultUser, generateDefaultCategory} = require('./utils/utils');

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
            await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction",
                value:123,
                date: "16/03/2023",
                type: "INCOME",
                categoryId: categoryCreated._id,
            });
            await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction2",
                value:1234,
                date: "16/03/2023",
                type: "INCOME",
                categoryId: categoryCreated._id,
            });



            const response = await request(app).get('/dashboard/weekcards').set({'Authorization':'bearer '+token});

            const expectation = [{
                _id: null,
                SUM: 1357
            }]

            expect(response.body).toMatchObject(expectation);
        })
    });
})
