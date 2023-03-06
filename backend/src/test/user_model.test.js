const request = require('supertest'), app = require('../app');
const mongo = require('./mongo-test');

mongo;

describe("homepage", function(){
    it("welcomes the user", ()=>{
        request(app).get("/")
        .expect(400)
    })
})