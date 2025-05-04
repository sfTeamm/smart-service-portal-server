const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'admin' }, 
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admin", adminSchema);
