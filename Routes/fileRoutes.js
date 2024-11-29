const express = require('express');
const fileController = require('../controllers/fileController');
const isAuthenticated = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', fileController.createFile);
router.get('/:filename', fileController.readFile);
router.put('/update', fileController.updateFile);
router.delete('/:filename', fileController.deleteFile);

// Fetch file list
router.get('/list', isAuthenticated, fileController.getFileList);

// Fetch uploaded files
router.get('/uploaded', fileController.getUploadedFiles);

module.exports = router;
