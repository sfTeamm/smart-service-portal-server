const express = require('express');
const {
  createClass,
  getAllClasses,
  updateClassWithId,
  deleteClassWithId
} = require('../controllers/classController');

const router = express.Router();

// Routes
router.post('/create', createClass);
router.get('/all', getAllClasses);
router.patch('/update/:id', updateClassWithId);
router.delete('/delete/:id', deleteClassWithId);

module.exports = router; 
