const Schedule = require("../models/Schedule");
const Student = require("../models/Student");
module.exports = {
getAllSchedules: async (req, res) => {
    try {
      const schedules = await Schedule.find()
        .populate("class")
        .populate("lecture")
        .populate("module");
  
      return res.status(200).json({
        success: true,
        message: "Successfully retrieved all schedules.",
        data: schedules,
      });
    } catch (err) {
      console.error("Error getting all schedules:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while retrieving all schedules.",
      });
    }
  },

  getAllScheduleWithClass: async (req, res) => {
    try {
      const classId = req.params.id;

      const schedules = await Schedule.find({ class: classId })
        .populate("class")
        .populate("lecture")
        .populate("module");

      if (schedules.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No schedules found for the given class.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved all schedules with class data.",
        data: schedules,
      });
    } catch (err) {
      console.error("Getting all schedules error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in getting all schedules.",
      });
    }
  },

createSchedule: async (req, res) => {
    try {
      const { lecture, module, class: classId, startTime, endTime } = req.body;

      if (!lecture || !module || !classId || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }
  
      const newSchedule = new Schedule({
        lecture,
        module,
        class: classId,
        startTime,
        endTime,
      });
  
      await newSchedule.save();
  
      return res.status(200).json({
        success: true,
        message: "Successfully created the Schedule.",
        data: newSchedule,
      });
    } catch (err) {
      console.error("Create schedule error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in creating Schedule.",
      });
    }
  },
  
  getSingleScheduleById: async (req, res) => {
    try {
      const id = req.params.id;

      const schedule = await Schedule.findById(id)
        .populate("class")
        .populate("lecture")
        .populate("module");

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved the schedule.",
        data: schedule,
      });
    } catch (err) {
      console.error("Get single schedule error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in retrieving schedule.",
      });
    }
  },

  updateScheduleById: async (req, res) => {
    try {
      const id = req.params.id;

      const updatedSchedule = await Schedule.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate("class lecture module");

      if (!updatedSchedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully updated the schedule.",
        data: updatedSchedule,
      });
    } catch (err) {
      console.error("Update schedule error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in updating schedule.",
      });
    }
  },

  deleteScheduleById: async (req, res) => {
    try {
      const id = req.params.id;

      const deletedSchedule = await Schedule.findByIdAndDelete(id);

      if (!deletedSchedule) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully deleted the schedule.",
        data: deletedSchedule,
      });
    } catch (err) {
      console.error("Delete schedule error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in deleting schedule.",
      });
    }
  },

  getSchedulesByLecture: async (req, res) => {
    try {
      const lectureId = req.params.id;
  
      const schedules = await Schedule.find({ lecture: lectureId })
        .populate("class")
        .populate("lecture")
        .populate("module");
  
      if (schedules.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No schedules found for this lecture.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Schedules retrieved for the lecture.",
        data: schedules,
      });
    } catch (err) {
      console.error("Error getting schedules by lecture:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while retrieving lecture schedules.",
      });
    }
  },

  getAllScheduleForStudent: async (req, res) => {
    try {
      const studentId = req.params.id;

      const student = await Student.findById(studentId).populate("class");
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const schedules = await Schedule.find({ class: { $in: student.class } })
        .populate("class")
        .populate("lecture")
        .populate("module");

      if (schedules.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No schedules found for the given student.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Successfully retrieved schedules for the student.",
        data: schedules,
      });
    } catch (err) {
      console.error("Error getting student schedules:", err);
      return res.status(500).json({
        success: false,
        message: "Server error in retrieving student schedules.",
      });
    }
  },
};
