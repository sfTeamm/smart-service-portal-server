const express = require('express');
const router = express.Router();

const { sendMaintenanceRequest, getMaintenanceRequests,updateMaintenanceStatus } = require('../controllers/maintenanceRequestController');

// Route to send a maintenance request from a student or lecture to the admin
router.post('/send-maintenance-request', sendMaintenanceRequest);

// Route to get all maintenance requests (for admin to view)
router.get('/get-maintenance-requests', getMaintenanceRequests);

router.patch('/update-status', updateMaintenanceStatus);

module.exports = router;
