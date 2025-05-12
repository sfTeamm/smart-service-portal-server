const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  student_num: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  class: { type: mongoose.Schema.ObjectId, ref: 'Class', required: false }, 
  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", studentSchema);
