const express = require('express');
const SchoolController = require('../controllers/schoolController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', SchoolController.getAllSchools);
router.get('/:id', SchoolController.getSchoolById);
router.post('/search', SchoolController.searchSchools);
router.post('/', authenticateToken, requireAdmin, SchoolController.createSchool);
router.put('/:id', authenticateToken, requireAdmin, SchoolController.updateSchool);
router.delete('/:id', authenticateToken, requireAdmin, SchoolController.deleteSchool);

module.exports = router;
