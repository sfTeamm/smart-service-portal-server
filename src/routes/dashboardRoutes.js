const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');


//get all dashboard states
router.get('/stats', getDashboardStats);

module.exports = router;
