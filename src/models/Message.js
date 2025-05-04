const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'sender.model' },
    model: { type: String, required: true, enum: ['Student', 'Lecture'] }
  },
  receiver: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiver.model' },
    model: { type: String, required: true, enum: ['Student', 'Lecture'] }
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
