const Notice= require('../models/Notice');

module.exports = {
  getAllNotices: async (req, res) => {
    try {
      const notices = await Notice.find();
      res.status(200).json({
        success: true,
        message: "Successfully retrieved all notices.",
        data: notices,
      });
    } catch (err) {
      console.error("Getting all notices error:", err);
      res.status(500).json({
        success: false,
        message: "Server error in getting all notices.",
      });
    }
  },

  getNoticesForStudents: async (req, res) => {
    try {
      const notices = await Notice.find({ audience: "student" });
      res.status(200).json({
        success: true,
        message: "Successfully retrieved student notices.",
        data: notices,
      });
    } catch (err) {
      console.error("Getting student notices error:", err);
      res.status(500).json({
        success: false,
        message: "Server error in getting student notices.",
      });
    }
  },

  getNoticesForLectures: async (req, res) => {
    try {
      const notices = await Notice.find({ audience: "lecture" });
      res.status(200).json({
        success: true,
        message: "Successfully retrieved lecture notices.",
        data: notices,
      });
    } catch (err) {
      console.error("Getting lecture notices error:", err);
      res.status(500).json({
        success: false,
        message: "Server error in getting lecture notices.",
      });
    }
  },

  createNotice: async (req, res) => {
    try {
      const newNotice = new Notice({
        title: req.body.title,
        message: req.body.message,
        audience: req.body.audience,
      });
      await newNotice.save();
      res.status(200).json({
        success: true,
        message: "Successfully created the notice.",
        data: newNotice,
      });
    } catch (err) {
      console.error("Create notice error:", err);
      res.status(500).json({
        success: false,
        message: "Server error in creating notice.",
      });
    }
  },

updateNoticeWithId: async (req, res) => {
    try {
      const id = req.params.id;
  
      const updatedNotice = await Notice.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
  
      if (!updatedNotice) {
        return res.status(404).json({
          success: false,
          message: "Notice not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Successfully updated the notice.",
        data: updatedNotice,
      });
    } catch (err) {
      console.error("Update notice error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in updating notice.",
      });
    }
  },
  
  deleteNoticeWithId: async (req, res) => {
    try {
      const id = req.params.id;
  
      const deletedNotice = await Notice.findByIdAndDelete(id);
  
      if (!deletedNotice) {
        return res.status(404).json({
          success: false,
          message: "Notice not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Successfully deleted the Notice.",
        data: deletedNotice,
      });
    } catch (err) {
      console.error("Delete notice error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in deleting notice.",
      });
    }
  },
  
};
