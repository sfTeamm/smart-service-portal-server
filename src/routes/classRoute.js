const express = require('express');
const {
  createClass,
  getAllClasses,
  updateClassWithId,
  deleteClassWithId,
  getClassStudentCounts 
} = require('../controllers/classController');

const router = express.Router();

router.post('/create', createClass);
router.get('/all', getAllClasses);
router.patch('/update/:id', updateClassWithId);
router.delete('/delete/:id', deleteClassWithId);
router.get('/student-counts', getClassStudentCounts); 

module.exports = router; 
