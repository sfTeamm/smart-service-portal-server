const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  class: { type: mongoose.Schema.ObjectId,ref:'Class' },
  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lecture", lectureSchema);
