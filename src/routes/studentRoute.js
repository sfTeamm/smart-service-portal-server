const express = require("express");

const {
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentOwnData,
  updateStudentWithId,
  deleteStudentWithId,
} = require("../controllers/studentController");

const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/all", getAllStudents);
router.get("/fetch-single", getStudentOwnData);
router.patch("/update/:id", updateStudentWithId);
router.delete("/delete/:id", deleteStudentWithId);

module.exports = router;
