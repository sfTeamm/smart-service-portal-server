const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  module_name: { type: String, required: true },
  module_code: { type: String, required: true }, 
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Module", moduleSchema);
