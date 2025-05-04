const express = require('express');
const {
  createModule,
  getAllModules,
  updateModuleWithId,
  deleteModuleWithId
} = require('../controllers/moduleController');

const router = express.Router();

// Routes
router.post('/create', createModule);
router.get('/all', getAllModules);
router.patch('/update/:id', updateModuleWithId);
router.delete('/delete/:id', deleteModuleWithId); 

module.exports = router; 
