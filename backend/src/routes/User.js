const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');

const {login} = require('../auth/userLogin');

router.post('/signup', 
    userMiddleware.validateUserBody, 
    userMiddleware.validateUserAlreadyExists, 
    userController.createUser
);
router.post('/signin', userMiddleware.validateLoginBody, login);


router.use(authMiddleware.validateUserLoggedIn);

router.put('/users', userMiddleware.validateUserBody,userController.updateUser);


module.exports = router;