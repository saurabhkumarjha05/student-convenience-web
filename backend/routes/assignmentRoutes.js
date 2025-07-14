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
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  // Allow PDF, images for request; PDF/ZIP for submission
  const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'application/zip', 'application/x-zip-compressed'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF, image, or ZIP files are allowed!'));
}});

// Create a new assignment request
router.post('/', verifyToken, upload.single('file'), assignmentController.createAssignment);
// Get all assignments (for helpers/admins)
router.get('/', verifyToken, assignmentController.getAllAssignments);
// Get assignments created by the logged-in user
router.get('/my', verifyToken, assignmentController.getMyAssignments);
// Helper accepts an assignment
router.put('/:id/accept', verifyToken, assignmentController.acceptAssignment);
// Helper submits completed work
router.put('/:id/submit', verifyToken, upload.single('file'), assignmentController.submitAssignment);
// Student marks assignment as received/completed
router.put('/:id/status', verifyToken, assignmentController.updateAssignmentStatus);

module.exports = router;
