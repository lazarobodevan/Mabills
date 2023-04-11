const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userMiddleware = require('../middlewares/userMiddleware');
const auth = require('../auth/userLogin');

const authMiddleware = require('../middlewares/authMiddleware');

const {login} = require('../auth/userLogin');

router.post('/signup', 
    userMiddleware.validateUserBody, 
    userMiddleware.validateUserAlreadyExists, 
    userController.createUser
);
router.post('/signin', userMiddleware.validateLoginBody, login);


router.use(authMiddleware.validateUserLoggedIn);

router.put('/users', 
    userMiddleware.validateUserBody, 
    userMiddleware.validateEmailAreadyInUse, 
    userController.updateUser
);

router.get('/user', auth.getLoggedUser);


module.exports = router;