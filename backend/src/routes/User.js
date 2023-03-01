const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');

const {login} = require('../auth/userLogin');

router.get('/health', (req, res) =>{
    res.status(200).send({message: "Server in running"});
});

router.post('/signup', 
    userMiddleware.validateUserBody, 
    userMiddleware.validateUserAlreadyExists, 
    userController.createUser
);
router.post('/signin', userMiddleware.validateLoginBody, login);
router.put('/users', userMiddleware.validateUserBody, authMiddleware.validateUserLoggedIn ,userController.updateUser);


module.exports = router;