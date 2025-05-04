const express = require("express");

const {
  registerLecture,
  loginLecture,
  getAllLectures,
  getLectureOwnData,
  updateLectureById,
  deleteLectureById,
  getLectureClass,
} = require("../controllers/lectureController");

const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerLecture);
router.post("/login", loginLecture);

// get all lectures
router.get("/all", getAllLectures); 
 // get their own data
router.get("/fetch-own", getLectureOwnData);
// update a lecture
router.patch("/update/:id",  updateLectureById); 
//delete a lecture
router.delete("/delete/:id",  deleteLectureById); 
router.get("/class/:id", getLectureClass);

module.exports = router;
