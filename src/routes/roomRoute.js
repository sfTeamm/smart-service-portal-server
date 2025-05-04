// routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

 // Create room
router.post("/create", roomController.createRoom);
// Get all rooms
router.get("/", roomController.getAllRooms);  
// Get available rooms
router.get("/available", roomController.getAvailableRooms);  
// Update room availability
router.patch("/update-availability", roomController.updateRoomAvailability);  
router.patch("/update/:id", roomController.updateRoom);
router.delete("/delete/:id", roomController.deleteRoom);

module.exports = router;
