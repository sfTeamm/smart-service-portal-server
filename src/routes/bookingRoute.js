// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Create booking
router.post("/create", bookingController.createBooking);  
// Get user bookings
router.get("/user/:userId/:userType", bookingController.getUserBookings);  
// Get all bookings for admin
router.get("/admin", bookingController.getAllBookings);
// Update booking status  
router.patch("/update-status", bookingController.updateBookingStatus); 
// Delete a booking 
router.delete("/delete/:bookingId", bookingController.deleteBooking);  

module.exports = router;
