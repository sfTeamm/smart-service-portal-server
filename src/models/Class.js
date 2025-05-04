const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class_name: { type: String, required: true },
  class_num: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Class", classSchema);
