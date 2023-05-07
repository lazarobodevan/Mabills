const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');
const mongo = require('./utils/test_db');
const utils = require('./utils/utils2');


jest.setTimeout(90*1000);

beforeAll(async ()=>{
    await mongo.connect();
    utils.generateDefaultUser();
});

afterAll(async ()=>{
    await mongo.clearDatabase();
    await mongo.closeDatabase();
})

describe('User domain',() => {
    describe('POST #createUser', ()=>{
        it('should create a user and return name, email, empty password, _id and ownCategories', async()=>{
            const response = await utils.generateDefaultUser();

            const expectation = {
                "email": "default@default.com",
                "name": "default",
                "password": ""
            }

            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('POST #createUser - Already exists', ()=>{
        it('should try  to create a user and return a message saying that user already exists', async()=>{
            const response = await utils.generateDefaultUser()

            const expectation = {
               message: "User already exists",
            }

            expect(response.body).toMatchObject(expectation);
        });
    });

    describe('POST #createUser - Invalid information', ()=>{
        it('should try  to create a user with invalid information', async()=>{
            const response = await utils.signUp('','t','');

            const expectation = [
                "\"email\" must be a valid email",
                "\"password\" is not allowed to be empty",
                "\"name\" is not allowed to be empty",
            ]

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expectation);
        });
    });

    describe('POST #login', ()=>{
        it('should find a user that matched email and password, and return their name, email and token', async ()=>{
            const response = await utils.loginDefaultUser();

            const expectation = {
                user:{
                    email: "default@default.com",
                    name: "default",
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
            const response = await utils.signIn('default@test.com','123');

            const expectation = {
                message:"Incorrect email or password"
            }

            expect(response.status).toBe(401);
            expect(response.body).toMatchObject(expectation);
        })
    })
    describe('POST #login - Invalid password', ()=>{
        it('should not find a user and return a message saying that email or password are incorrects', async ()=>{
            const response = await utils.signIn('default@default.com','1234');

            const expectation = {
                message:"Incorrect email or password"
            }

            expect(response.status).toBe(401);
            expect(response.body).toMatchObject(expectation);
        })
    })

    /*
    * UPDATE USER DOES NOT WORK ON TEST - NEED TO WORK ON THIS
    */

    // describe('PUT #updateUser', ()=>{
    //     it('should update user information', async ()=>{

    //         const token = (await utils.loginDefaultUser()).body.token;
            
    //         const response = await utils.updateUser('test@test.com','t','123', token);

    //         const expectation = {
    //             email:"test@test.com",
    //             name: "t",
    //             password: ""
    //         }

    //         expect(response.status).toBe(201);
    //         expect(response.body).toMatchObject(expectation);
    //     })
    // });

    describe('PUT #updateUser - Not logged in', ()=>{
        it('should forbid user update', async ()=>{
            const response = await utils.updateUser("test@test.com", 'test', '123', '')

            const expectation = {
                message:"Access denied"
            }

            expect(response.status).toBe(403);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('PUT #updateUser - Email already in use', ()=>{
        it('should deny email update and send a message saying that the email is already in use', async ()=>{
            
            //Creating a User
            await utils.signUp('test','test@test.com','123');

            //Loggin-in
            const user = await utils.loginDefaultUser();

            //Trying to update user with email already taken
            const response = await utils.updateUser('test@test.com','t','123', user.body.token);

            const expectation = {
                message:"Email already in use"
            }

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject(expectation);
        })
    })

    describe('DELETE #deleteUser', ()=>{
        it('should delete user by id', async ()=>{
            await mongo.clearDatabase();
            
            await utils.generateDefaultUser();
            const user = await utils.loginDefaultUser();   

            const response = await request(app).delete('/user/'+user.body.user.id).set({'Authorization':'bearer '+user.body.token}).send();

            const expectation = {
                message:"User deleted"
            }

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(expectation);
        })
    })
});