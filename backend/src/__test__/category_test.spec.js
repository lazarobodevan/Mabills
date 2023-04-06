const {expect, test} = require('@jest/globals');
const request = require('supertest');

const app = require('../app');

const mongo = require('./utils/test_db');

const {generateDefaultUser, loginDefaultUser} = require('./utils/utils');
const utils = require('./utils/utils');

let token;
let categoryCreated;
let transactionCreated;

//jest.setTimeout(90*1000);

beforeAll(async ()=>{
    await mongo.connect();
    user = await generateDefaultUser();
    token = await loginDefaultUser();
});

afterAll(async ()=>{
    await mongo.clearDatabase();
    await mongo.closeDatabase();
})

describe('Category domain',() => {
    describe('POST #createCategory', ()=>{
        it('should create a category and relate to the logged user and return its data', async()=>{
            const response = await request(app).post('/category').set({'Authorization':'bearer '+token}).send({
                name: "test",
                color: '#FFFFFF'
            });

            const expectation = {
                name: "test",
                color: '#FFFFFF'
            }
            categoryCreated = response.body;
            expect(response.body).toMatchObject(expectation);
        });
    })

    describe('POST #createCategory - Invalid body', ()=>{
        it('should not create a category and return an error message', async()=>{
            const response = await request(app).post('/category').set({'Authorization':'bearer '+token}).send({
                name: "",
                color: '',
                t:2
            });

            const expectation = 
                [
                    "\"name\" is not allowed to be empty",
                    "\"color\" is not allowed to be empty",
                    "\"t\" is not allowed",
                ]

            expect(response.body).toEqual(expectation);
        });
    })

    describe('POST #createCategory - Not logged in', ()=>{
        it('shoudl forbid category creation', async()=>{
            const response = await request(app).post('/category').send({
                name: "test",
                color: "#FFFFFF"
            });

            const expectation = {
                message:"Access denied"
            }

            expect(response.status).toBe(403);
            expect(response.body).toMatchObject(expectation);
        });
    })

    describe('PUT #updateCategory', ()=>{
        it('should update category information', async ()=>{
            const response = await request(app).put(`/category/${categoryCreated._id}`).set({'Authorization':'bearer '+token}).send({
                name: "updated",
                color: '#FFFFFF'
            });

            const expectation = {
                name: "updated",
                color: '#FFFFFF'
            }

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('PUT #updateCategory - Invalid body', ()=>{
        it('should update category information', async ()=>{
            const response = await request(app).put(`/category/${categoryCreated._id}`).set({'Authorization':'bearer '+token}).send({
                name: "",
                color: '#FFFFFF',
                t:2
            });

            const expectation = [
              "\"name\" is not allowed to be empty",
              "\"t\" is not allowed",
            ]

            expect(response.status).toBe(400);
            expect(response.body).toEqual(expectation);
        })
    });

    describe('PUT #updateCategory - Not logged in', ()=>{
        it('should forbid update category', async ()=>{
            const response = await request(app).put(`/category/${categoryCreated._id}`).send({
                name: "updated",
                color: '#FFFFFF'
            });

            const expectation = {
                message:"Access denied"
            }

            expect(response.status).toBe(403);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('GET #getCategories', ()=>{
        it('should return logged user categories', async ()=>{
            const response = await request(app).get('/categories').set({'Authorization':'bearer '+token});
            const {userId} = response.body[0];
            const expectation = 
                {
                    __v: 0, 
                    name: "updated", 
                    color: '#FFFFFF',
                    userId
                }
            

            expect(response.status).toBe(200);
            expect(response.body[0]).toMatchObject(expectation);
        })
    });

    describe('GET #getCategories - Not logged in', ()=>{
        it('should deny getCategories of unlogged user', async ()=>{
            const response = await request(app).get('/categories');
            const expectation = 
                {
                    message:"Access denied"
                }
            

            expect(response.status).toBe(403);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('DELETE #deleteCategory - Not logged in', ()=>{
        it('should deny delete category of unlogged user', async ()=>{
            const response = await request(app).delete(`/category/${categoryCreated._id}`);
            const expectation = 
                {
                    message:"Access denied"
                }
            

            expect(response.status).toBe(403);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('DELETE #deleteCategory - Category related to transaction', ()=>{
        it('should not delete category that is related to any transaction', async ()=>{
            transactionCreated = await utils.populateTransactions(token, categoryCreated);
            const response = await request(app).delete(`/category/${categoryCreated._id}`).set({'Authorization':'bearer '+token});
            const expectation = 
                {
                    message:"Cannot delete category that is related to any transaction."
                }
            

            expect(response.status).toBe(400);
            expect(response.body).toMatchObject(expectation);
        })
    });

    describe('DELETE #deleteCategory', ()=>{
        it('should not delete category that is related to any transaction', async ()=>{
            const category = await utils.generateDefaultCategory(token);
            
            const response = await request(app).delete(`/category/${category._id}`).set({'Authorization':'bearer '+token});
            const expectation = 
                {
                    message:"Category deleted"
                }
            

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(expectation);
        })
    });




})