const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.use(authMiddleware.validateUserLoggedIn);

router.get('/dashboard/weekcards', dashboardController.getWeekCards);
router.get('/dashboard/expenses-by-category-week', dashboardController.getWeekExpensesByCategory);
router.get('/dashboard/incomes-by-category-week', dashboardController.getWeekIncomeByCategory);

router.get('/dashboard/monthCards', dashboardController.getDashboardCards);

module.exports = router;