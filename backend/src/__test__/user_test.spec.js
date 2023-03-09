const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./test_db');

jest.setTimeout(90*1000);

beforeAll(async ()=>{
    console.log('connecting...');
    await mongo.connect();
    console.log('connected');
});

afterAll(async ()=>{
    await mongo.clearDatabase();
    await mongo.closeDatabase();
})

describe('User domain',() => {
    describe('#createUser', ()=>{
        it('should create a user and return name, email, empty password, _id and ownCategories', async()=>{
            console.log('começou');
            const response = await request(app).post('/signup').send({
                email: "test@test.com",
                name: "test",
                password: "123"
            });

            const expectation = {
                "email": "test@test.com",
                "name": "test",
                "password": ""
            }

            expect(response.body).toMatchObject(expectation);
        });
    })
})