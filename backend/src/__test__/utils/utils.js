const UserModel = require("../../models/UserModel")
const request = require('supertest');

const app = require('../../app');

const generateDefaultUser = async() => {
    const response = await request(app).post('/signup').send({
        email:'default@default.com',
        password:'123',
        name: 'default'
    });
    return response.body;
}

const loginDefaultUser = async () =>{
    const response = await request(app).post('/signin').send({
        email: 'default@default.com',
        password: '123'
    });

    return response.body.token;
}

module.exports = {
    generateDefaultUser,
    loginDefaultUser
}