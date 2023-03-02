const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');

router.use(authMiddleware.validateUserLoggedIn);

router.post('/category', categoryController.createCategory);

module.exports = router;