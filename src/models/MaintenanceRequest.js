const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'sender.model' },
    model: { type: String, required: true, enum: ['Student', 'Lecture'] }
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Resolved','In Progress'], default: 'Pending' },
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
