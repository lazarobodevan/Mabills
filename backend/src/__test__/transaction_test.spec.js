const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {generateDefaultUser, loginDefaultUser, generateDefaultCategory} = require('./utils/utils');

let token;
let categoryCreated;

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

describe('Transaction domain',() => {
    describe('POST #createTransaction - INCOME', ()=>{
        it('should create an INCOME transaction and relate to the logged user and return its data', async()=>{
            const response = await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction",
                value:123,
                date: "25/02/2023",
                type: "INCOME",
                categoryId: categoryCreated._id,
            });

            const expectation = {
                newTransaction: {
                    userId: user._id,
                    name: "transaction",
                    value: 123,
                    date: "2023-02-25T00:00:00.000Z",
                    type: "INCOME",
                    categoryId: categoryCreated._id,
                },
                category: categoryCreated
            }

            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('POST #createTransaction - INCOME - isPaid error', ()=>{
        it('should try to create an INCOME transaction with  and relate to the logged user and return its data', async()=>{
            const response = await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction",
                value:123,
                date: "25/02/2023",
                type: "INCOME",
                isPaid: true,
                categoryId: categoryCreated._id,
            });

            console.log(JSON.stringify(response.body));

            const expectation = {
                "_original": {
                  "name": "transaction",
                  "value": 123,
                  "date": "2023-02-25T00:00:00.000Z",
                  "type": "INCOME",
                  "isPaid": true,
                  "categoryId": categoryCreated._id
                },
                "details": [
                  {
                    "message": "\"isPaid\" is not allowed",
                    "path": [
                      "isPaid"
                    ],
                    "type": "object.unknown",
                    "context": {
                      "child": "isPaid",
                      "label": "isPaid",
                      "value": true,
                      "key": "isPaid"
                    }
                  }
                ]
              }

            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('POST #createTransaction - EXPENSE - paid true', ()=>{
        it('should create a paid EXPENSE transaction and relate to the logged user and return its data', async()=>{
            const response = await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction",
                value:123,
                date: "25/02/2023",
                type: "EXPENSE",
                isPaid: true,
                categoryId: categoryCreated._id,
            });

            console.log("corpo: "+JSON.stringify(response))


            const expectation = {
                newTransaction: {
                    userId: user._id,
                    name: "transaction",
                    value: 123,
                    date: "2023-02-25T00:00:00.000Z",
                    type: "EXPENSE",
                    isPaid: true,
                    categoryId: categoryCreated._id,                    
                },
                category: categoryCreated
            }

            expect(response.body).toMatchObject(expectation);
        });
    });
    });
    describe('POST #createTransaction - EXPENSE - paid false', ()=>{
        it('should create a unpaid EXPENSE transaction and relate to the logged user and return its data', async()=>{
            const response = await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction",
                value:123,
                date: "25/02/2023",
                type: "EXPENSE",
                isPaid: false,
                categoryId: categoryCreated._id,
            });


            const expectation = {
                newTransaction: {
                    userId: user._id,
                    name: "transaction",
                    value: 123,
                    date: "2023-02-25T00:00:00.000Z",
                    type: "EXPENSE",
                    isPaid: false,
                    categoryId: categoryCreated._id,                    
                },
                category: categoryCreated
            }

            expect(response.body).toMatchObject(expectation);
        });
})