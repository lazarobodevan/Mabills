const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');
const utils = require('./utils/utils2');

let token;
let categoryCreated;

beforeAll(async ()=>{
    await mongo.connect();
    user = await utils.generateDefaultUser();
    user = user.body;
    token = await utils.loginDefaultUser();
    token = token.body.token
    categoryCreated = await utils.generateCategory(token,'defaultCategory');
});

afterAll(async ()=>{
    await mongo.clearDatabase();
    await mongo.closeDatabase();
})

describe('Dashboard domain',() => {
    describe('GET #getWeekCards', ()=>{
        it('should get total value and variation from this week to the last one of bills to receive, bills to pay and late bills', async()=>{
            await utils.addThisWeekIncome(token, 200, categoryCreated);
            await utils.addThisWeekToBePaid(token, 100, categoryCreated);
            await utils.addThisWeekToExpire(token, 200, categoryCreated);

            await utils.addLastWeekIncome(token, 100, categoryCreated);
            await utils.addLastWeekToBePaid(token, 200, categoryCreated);
            await utils.addLastWeekToExpire(token, 100, categoryCreated);
            
            const response = await request(app).get('/dashboard/week/cards').set({'Authorization':'bearer '+token});
            
            const expectation = {
                toReceive: { value: 200, variation: 100 },
                toPay: { value: 100, variation: -50 },
                toExpire: { value: 200, variation: 100 }
              }

            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('GET #getWeekExpenses', ()=>{
        it('should get total expenses by category from the current week', async()=>{

            const newCategory = await utils.generateCategory(token, 'cat2');
            
            await utils.addThisWeekIncome(token, 1, newCategory);
            await utils.addThisWeekToBePaid(token, 1, newCategory);
            await utils.addThisWeekToExpire(token, 1, newCategory);

            await utils.addLastWeekIncome(token, 1, newCategory);
            await utils.addLastWeekToBePaid(token, 1, newCategory);
            await utils.addLastWeekToExpire(token, 1, newCategory);
            
            const response = await request(app).get('/dashboard/week/expensesByCategory').set({'Authorization':'bearer '+token});
            
            const expectation = [
                { _id: { name: 'defaultCategory', color: '#FFFFFF' }, SUM: 300 },
                { _id: { name: 'cat2', color: '#FFFFFF' }, SUM: 2 }
              ]

              expect(response.body).toEqual(
                expect.arrayContaining(expectation)
              );
        })
    });

    describe('GET #getWeekIncome', ()=>{
        it('should get total income by category from the current week', async()=>{

            const response = await request(app).get('/dashboard/week/incomesByCategory').set({'Authorization':'bearer '+token});

            const expectation = [
                { _id: { name: 'defaultCategory', color: '#FFFFFF' }, SUM: 200 },
                { _id: { name: 'cat2', color: '#FFFFFF' }, SUM: 1 }
              ]

              expect(response.body).toEqual(
                expect.arrayContaining(expectation)
              );
        })
    });

})
