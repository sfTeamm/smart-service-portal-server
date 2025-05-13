const Room = require("../models/Room");

module.exports = {
createRoom: async (req, res) => {
  try {
    const { name, roomType, description } = req.body;

    if (!name || !roomType || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newRoom = new Room({
      name,
      roomType,
      description,
      availability: true,
    });

    await newRoom.save();
    res.status(201).json({ success: true, message: "Room created", data: newRoom });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(400).json({ success: false, message: "Room name already exists" });
    }

    console.error("Error creating room:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
},
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find().sort({ bookingDate: -1 });
      res.status(200).json({ success: true, data: rooms });
    } catch (err) {
      console.error("Error fetching rooms:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

getAvailableRooms: async (req, res) => {
    try {
      const availableRooms = await Room.find({ availability: true });
  
      res.status(200).json({ success: true, data: availableRooms });
    } catch (err) {
      console.error("Error fetching available rooms:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  updateRoomAvailability: async (req, res) => {
    try {
      const { roomId, availability } = req.body;

      if (typeof availability !== "boolean") {
        return res.status(400).json({ success: false, message: "Availability must be a boolean" });
      }

      const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { availability },
        { new: true }
      );

      if (!updatedRoom) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      res.status(200).json({ success: true, data: updatedRoom });
    } catch (err) {
      console.error("Error updating room availability:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const updatedRoom = await Room.findByIdAndUpdate(id, updates, { new: true });
  
      if (!updatedRoom) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
  
      res.status(200).json({ success: true, data: updatedRoom });
    } catch (err) {
      console.error("Error updating room:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedRoom = await Room.findByIdAndDelete(id);

      if (!deletedRoom) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      res.status(200).json({ success: true, message: "Room deleted successfully" });
    } catch (err) {
      console.error("Error deleting room:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};
