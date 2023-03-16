const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {generateDefaultUser, loginDefaultUser, generateDefaultCategory} = require('./utils/utils');

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

            transactionCreated = response.body;

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

    describe('POST #createTransaction - EXPENSE - isPaid true', ()=>{
        it('should create a paid EXPENSE transaction and relate to the logged user and return its data', async()=>{
            const response = await request(app).post('/transactions').set({'Authorization':'bearer '+token}).send({
                name: "transaction",
                value:123,
                date: "25/02/2023",
                type: "EXPENSE",
                isPaid: true,
                categoryId: categoryCreated._id,
            });

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

    describe('POST #createTransaction - EXPENSE - isPaid false', ()=>{
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

    });
    
    describe('POST #getTransaction - no filter', ()=>{
        it('should return all transactions from logged user with pagination', async()=>{
            const response = await request(app).post('/transactions/filter').set({'Authorization':'bearer '+token}).send({
            });

            const expectation = {
                "nextUrl": null,
                "previousUrl": null,
                "limit": 5,
                "offset": 0,
                "total": 3,
                "results": [
                  {
                    "userId": user._id,
                    "name": "transaction",
                    "value": 123,
                    "date": "2023-02-25T00:00:00.000Z",
                    "type": "INCOME",
                    "categoryId": {
                      "_id": categoryCreated._id,
                      "userId": user._id,
                      "name": "defaultCategory",
                      "icon": "defaultCategory.png",
                      "__v": 0
                    },
                    "__v": 0
                  },
                  {
                    "userId": user._id,
                    "name": "transaction",
                    "value": 123,
                    "date": "2023-02-25T00:00:00.000Z",
                    "type": "EXPENSE",
                    "isPaid": true,
                    "categoryId": {
                      "_id": categoryCreated._id,
                      "userId": user._id,
                      "name": "defaultCategory",
                      "icon": "defaultCategory.png",
                      "__v": 0
                    },
                    "__v": 0
                  },
                  {
                    "userId": user._id,
                    "name": "transaction",
                    "value": 123,
                    "date": "2023-02-25T00:00:00.000Z",
                    "type": "EXPENSE",
                    "isPaid": false,
                    "categoryId": {
                      "_id": categoryCreated._id,
                      "userId": user._id,
                      "name": "defaultCategory",
                      "icon": "defaultCategory.png",
                      "__v": 0
                    },
                    "__v": 0
                  }
                ]
              }

            expect(response.body).toMatchObject(expectation);
        });

    });
    describe('POST #getTransaction - filters', ()=>{
        it('should return filtered transactions from logged user with pagination', async()=>{
            const response = await request(app).post('/transactions/filter').set({'Authorization':'bearer '+token}).send({
                type: 'EXPENSE',
                isPaid: true,
                date: '25/02/2023',
                categoryId: categoryCreated._id,
                value: 123,
                name: 'transaction'
            });

            console.log("a : " + JSON.stringify(response.body))

            const expectation = {
                "nextUrl": null,
                "previousUrl": null,
                "limit": 5,
                "offset": 0,
                "total": 3,
                "results": [
                  {
                    "userId": user._id,
                    "name": "transaction",
                    "value": 123,
                    "date": "2023-02-25T00:00:00.000Z",
                    "type": "EXPENSE",
                    "isPaid": true,
                    "categoryId": {
                      "_id": categoryCreated._id,
                      "userId": user._id,
                      "name": "defaultCategory",
                      "icon": "defaultCategory.png",
                      "__v": 0
                    },
                    "__v": 0
                  }
                ]
              }

            expect(response.body).toMatchObject(expectation);
        });

    });

    describe('PUT #updateTransaction', ()=>{
        it('should update an INCOME transaction and relate to the logged user and return its data', async()=>{
            const response = await request(app).put(`/transactions/${transactionCreated.newTransaction._id}`).set({'Authorization':'bearer '+token}).send({
                name: "transaction2",
                value:1234,
                date: "26/02/2023",
                type: "EXPENSE",
                isPaid: false,
                categoryId: categoryCreated._id,
            });

            console.log(JSON.stringify(response.body))

            const expectation = {
                "userId": user._id,
                "name": "transaction2",
                "value": 1234,
                "date": "2023-02-26T00:00:00.000Z",
                "type": "EXPENSE",
                "categoryId": {
                  "_id": categoryCreated._id,
                  "userId": user._id,
                  "name": "defaultCategory",
                  "icon": "defaultCategory.png",
                  "__v": 0
                },
                "__v": 0,
                "isPaid": false
              }

            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('DELETE #deleteTransaction', ()=>{
        it('should delete transaction by its id', async()=>{
            const response = await request(app).delete(`/transactions/${transactionCreated.newTransaction._id}`).set({'Authorization':'bearer '+token}).send({
            });

            const expectation = {
                message: 'Object deleted'
              }

            expect(response.body).toMatchObject(expectation);
        });
    });

})