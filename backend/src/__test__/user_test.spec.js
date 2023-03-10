const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {generateDefaultUser} = require('./utils/utils');

let userToken;

jest.setTimeout(90*1000);

beforeAll(async ()=>{
    await mongo.connect();
    await generateDefaultUser();
});

afterAll(async ()=>{
    await mongo.clearDatabase();
    await mongo.closeDatabase();
})

describe('User domain',() => {
    describe('POST #createUser', ()=>{
        it('should create a user and return name, email, empty password, _id and ownCategories', async()=>{
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
    });

    describe('POST #createUser - Already exists', ()=>{
        it('should try  to create a user and return a message saying that user already exists', async()=>{
            const response = await request(app).post('/signup').send({
                email: "test@test.com",
                name: "test",
                password: "123"
            });

            const expectation = {
               message: "User already exists",
            }

            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('POST #createUser - Invalid information', ()=>{
        it('should try  to create a user with invalid information', async()=>{
            const response = await request(app).post('/signup').send({
                email: "test",
                name: "",
                password: ""
            });

            const expectation = {
                "_original": {
                  "email": "test",
                  "name": "",
                  "password": ""
                },
                "details": [
                  {
                    "message": "\"email\" must be a valid email",
                    "path": [
                      "email"
                    ],
                    "type": "string.email",
                    "context": {
                      "value": "test",
                      "invalids": [
                        "test"
                      ],
                      "label": "email",
                      "key": "email"
                    }
                  },
                  {
                    "message": "\"password\" is not allowed to be empty",
                    "path": [
                      "password"
                    ],
                    "type": "string.empty",
                    "context": {
                      "label": "password",
                      "value": "",
                      "key": "password"
                    }
                  },
                  {
                    "message": "\"name\" is not allowed to be empty",
                    "path": [
                      "name"
                    ],
                    "type": "string.empty",
                    "context": {
                      "label": "name",
                      "value": "",
                      "key": "name"
                    }
                  }
                ]
              }

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('POST #login', ()=>{
        it('should find a user that matched email and password, and return their name, email and token', async ()=>{
            const response = await request(app).post('/signin').send({
                email: "test@test.com",
                password: "123"
            });

            const expectation = {
                user:{
                    email: "test@test.com",
                    name: "test",
                    ownCategories:[]
                }
                
            }

            userToken = response.body.token;
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user.id');
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('POST #login - Invalid email', ()=>{
        it('should not find a user and return a message saying that email or password are incorrects', async ()=>{
            const response = await request(app).post('/signin').send({
                email: "test1@test.com",
                password: "123"
            });

            const expectation = {
                message:"Incorrect email or password"
            }

            expect(response.status).toBe(401);
            expect(response.body).toMatchObject(expectation);
        })
    })
    describe('POST #login - Invalid password', ()=>{
        it('should not find a user and return a message saying that email or password are incorrects', async ()=>{
            const response = await request(app).post('/signin').send({
                email: "test@test.com",
                password: "1234"
            });

            const expectation = {
                message:"Incorrect email or password"
            }

            expect(response.status).toBe(401);
            expect(response.body).toMatchObject(expectation);
        })
    })
    describe('PUT #updateUser', ()=>{
        it('should update user information', async ()=>{
            const response = await request(app).put('/users').set({'Authorization':'bearer '+userToken}).send({
                email:"teste2@teste.com",
                name: "teste1",
                password: "12345"
            });

            const expectation = {
                email:"teste2@teste.com",
                name: "teste1",
                password: ""
            }

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('PUT #updateUser - Not logged in', ()=>{
        it('should forbid user update', async ()=>{
            const response = await request(app).put('/users').send({
                email:"teste2@teste.com",
                name: "teste1",
                password: "12345"
            });

            const expectation = {
                message:"Access denied"
            }

            expect(response.status).toBe(403);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('PUT #updateUser - Email already in use', ()=>{
        it('should deny email update and send a message saying that the email is already in use', async ()=>{
            const response = await request(app).put('/users').set({'Authorization':'bearer '+userToken}).send({
                email:"default@default.com",
                name: "teste1",
                password: "12345"
            });

            const expectation = {
                message:"Email already in use"
            }

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject(expectation);
        })
    })
});