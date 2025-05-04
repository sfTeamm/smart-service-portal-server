const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controllers/notificationController');

// Route to get all notifications for a user
router.get('/:userId/:userType', getNotifications);

module.exports = router;
