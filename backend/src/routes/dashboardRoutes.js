const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.use(authMiddleware.validateUserLoggedIn);

router.get('/dashboard/week/cards', dashboardController.getWeekCards);
router.get('/dashboard/week/expensesByCategory', dashboardController.getWeekExpensesByCategory);
router.get('/dashboard/week/incomesByCategory', dashboardController.getWeekIncomeByCategory);

router.get('/dashboard/month/cards', dashboardController.getDashboardCards);
router.get('/dashboard/month/expensesByCategory', dashboardController.getMonthExpensesByCategory);
router.get('/dashboard/month/incomesByCategory', dashboardController.getMonthIncomeByCategory);

router.get('/dashboard/year/incomesAndExpenses', dashboardController.getYearIncomesExpenses);

module.exports = router;