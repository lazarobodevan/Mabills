const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const userMiddleware = require('./middlewares/userMiddleware');

router.get('/health', (req, res) =>{
    res.status(200).send({message: "Server in running"});
});

router.post('/users', userMiddleware.validateUserSignUp, userController.createUser)

module.exports = router;