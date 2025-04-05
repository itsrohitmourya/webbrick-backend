const express = require('express');
const { 
  createProject, 
  getUserProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  updateProjectComplete,
} = require('../controllers/projectController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Use authMiddleware to protect all routes
router.use(authMiddleware);

router.post('/', createProject);              // Create project
router.get('/', getUserProjects);             // Get all user projects
router.get('/:id', getProjectById);           // Get project by ID
router.put('/:id', updateProject);            // Update project by ID
router.delete('/:id', deleteProject);         // Delete project by ID
router.put('/:id/complete', updateProjectComplete); 


module.exports = router;
