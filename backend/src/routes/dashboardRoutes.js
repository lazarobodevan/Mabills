const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.use(authMiddleware.validateUserLoggedIn);

router.get('/dashboard/weekcards', dashboardController.getWeekCards);

module.exports = router;