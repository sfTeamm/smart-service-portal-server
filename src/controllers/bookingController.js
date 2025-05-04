const Booking = require("../models/Booking");
const Room = require("../models/Room");

module.exports = {
  createBooking: async (req, res) => {
    try {
      const { userId, userType, roomId, bookingDate, timeSlot } = req.body;
  
      if (!userId || !userType || !roomId || !bookingDate || !timeSlot) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
  
      const existingBooking = await Booking.findOne({
        roomId,
        bookingDate,
        timeSlot,
        status: { $in: ['pending', 'approved'] } 
      });
  
      if (existingBooking) {
        return res.status(400).json({ success: false, message: "Room is already booked for this time slot." });
      }
  
      const newBooking = new Booking({
        userId,
        userType,
        roomId,
        bookingDate,
        timeSlot,
        status: 'pending',
      });
  
      await newBooking.save();
  
      res.status(201).json({ success: true, message: "Booking created", data: newBooking });
  
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },  

  getUserBookings: async (req, res) => {
    try {
      const { userId, userType } = req.params;

      const bookings = await Booking.find({ userId, userType }).populate('roomId');
      res.status(200).json({ success: true, data: bookings });
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId, status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }

      const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
      res.status(200).json({ success: true, data: booking });
    } catch (err) {
      console.error("Error updating booking status:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

    getAllBookings: async (req, res) => {
      try {
        const bookings = await Booking.find().populate('roomId');
        res.status(200).json({ success: true, data: bookings });
      } catch (err) {
        console.error("Error fetching all bookings:", err);
        res.status(500).json({ success: false, message: "Server error" });
      }
    },

  deleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      const deletedBooking = await Booking.findByIdAndDelete(bookingId);

      if (!deletedBooking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (err) {
      console.error("Error deleting booking:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
  
};
