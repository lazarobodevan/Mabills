const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/categoryController');
const categoryMiddleware = require('../middlewares/categoryMiddleware');

router.use(authMiddleware.validateUserLoggedIn);

router.post('/category', categoryMiddleware.validateCategoryBody, categoryController.createCategory);
router.put('/category/:id',categoryMiddleware.validateCategoryBody, categoryController.editCategory);
router.get('/categories', categoryController.getCategories);
router.delete('/category/:id', categoryController.deleteCategory);

module.exports = router;