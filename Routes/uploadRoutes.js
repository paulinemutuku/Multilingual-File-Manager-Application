const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const fileController = require('../controllers/fileController');


// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// File upload route
router.post('/', upload.single('file'), (req, res) => {
  res.json({ success: true, message: 'File uploaded successfully!' });
});

// Route to get list of files
router.get('/', (req, res) => {
  const directoryPath = path.join(__dirname, '../uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Unable to scan files:', err);
      return res.status(500).json({ success: false, message: 'Unable to scan files' });
    }
    const fileInfos = files.map(file => ({
      filename: file,
      url: `/uploads/${file}` 
    }));
    res.status(200).json(fileInfos);
  });
});

// Fetch uploaded files
router.get('/uploaded', fileController.getUploadedFiles);

module.exports = router;
