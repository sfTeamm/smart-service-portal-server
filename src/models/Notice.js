const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum:['student','lecture'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notice", noticeSchema);

