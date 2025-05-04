const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.ObjectId, ref: "Lecture" },
  module: { type: mongoose.Schema.ObjectId, ref: "Module" },
  class: { type: mongoose.Schema.ObjectId, ref: "Class" },
  startTime:{type:Date, required:true},
  endTime:{type:Date, required:true},

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
