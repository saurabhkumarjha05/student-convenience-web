const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const assignmentController = require('../controllers/assignmentController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/assignments/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Create assignment (with file upload)
router.post('/', verifyToken, upload.single('file'), assignmentController.createAssignment);
// List all assignments
router.get('/', verifyToken, assignmentController.getAssignments);
// Get one assignment
router.get('/:id', verifyToken, assignmentController.getAssignmentById);
// Update assignment
router.put('/:id', verifyToken, assignmentController.updateAssignment);
// Delete assignment
router.delete('/:id', verifyToken, assignmentController.deleteAssignment);

module.exports = router;
