const express = require("express");
const router = express.Router();

const {
  getAllScheduleWithClass,
  createSchedule,
  getSingleScheduleById,
  updateScheduleById,
  deleteScheduleById,
  getAllSchedules,
  getSchedulesByLecture,
  getAllScheduleForStudent,
} = require("../controllers/scheduleController");

// Get all schedules for a specific class
router.get("/class/:id", getAllScheduleWithClass);

router.get("/all", getAllSchedules);

// Create a new schedule
router.post("/create", createSchedule);

// Get a single schedule
router.get("/:id", getSingleScheduleById);

// Update a schedule
router.patch("/:id", updateScheduleById);

// Delete a schedule
router.delete("/:id", deleteScheduleById);

router.get("/lecture/:id", getSchedulesByLecture);

router.get("/student/:id", getAllScheduleForStudent);


module.exports = router;
