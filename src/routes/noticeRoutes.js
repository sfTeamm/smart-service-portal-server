const express = require('express');
const {
  createNotice,
  getAllNotices,
  getNoticesForStudents,
  getNoticesForLectures,
  updateNoticeWithId,
  deleteNoticeWithId
} = require('../controllers/noticeController');

const router = express.Router();

// Routes
// create notices 
router.post('/create', createNotice);
// Fetch all notices
router.get('/all', getAllNotices);
// Fetch notices for students
router.get('/student', getNoticesForStudents);
// Fetch notices for lectures  
router.get('/lecture', getNoticesForLectures);
// update notices  
router.patch('/update/:id', updateNoticeWithId);
router.delete('/delete/:id', deleteNoticeWithId);

module.exports = router;
