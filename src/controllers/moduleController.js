const Module = require('../models/Module');
const Schedule = require("../models/Schedule");

module.exports = {
  getAllModules: async (req, res) => {
    try {
      const modules = await Module.find();
      res.status(200).json({
        success: true,
        message: "Successfully retrieved all modules.",
        data: modules,
      });
    } catch (err) {
      console.error("Getting all modules error:", err);
      res.status(500).json({
        success: false,
        message: "Server error in getting all modules.",
      });
    }
  },

  createModule: async (req, res) => {
    try {
      const newModule = new Module({
        module_name: req.body.module_name,
        module_code: req.body.module_code,
      });
      await newModule.save();
      res.status(200).json({
        success: true,
        message: "Successfully created the module.",
        data: newModule,
      });
    } catch (err) {
      console.error("Create module error:", err);
      res.status(500).json({
        success: false,
        message: "Server error in creating module.",
      });
    }
  },

updateModuleWithId: async (req, res) => {
    try {
      const id = req.params.id;
  
      const updatedModule = await Module.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      if (!updatedModule) {
        return res.status(404).json({
          success: false,
          message: "Module not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Successfully updated the module.",
        data: updatedModule,
      });
    } catch (err) {
      console.error("Update module error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in updating module.",
      });
    }
  },
  
  deleteModuleWithId: async (req, res) => {
    try {
      const id = req.params.id;
  
      const deletedModule = await Module.findByIdAndDelete(id);
  
      if (!deletedModule) {
        return res.status(404).json({
          success: false,
          message: "Module not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Successfully deleted the module.",
        data: deletedModule,
      });
    } catch (err) {
      console.error("Delete module error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in deleting module.",
      });
    }
  },
  
};
