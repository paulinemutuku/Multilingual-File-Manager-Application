const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const directoryPath = path.join(__dirname, '../uploads');
const fileQueue = require('../config/queue');

// Helper function to ensure directory existence
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

// Create a new file
exports.createFile = (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(__dirname, '../uploads', filename);

  ensureDirectoryExistence(filePath);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return res.status(500).send('Server error while creating file');
    }

    db.query('INSERT INTO files (filename, path) VALUES (?, ?)', [filename, filePath], (err, result) => {
      if (err) {
        console.error('Error inserting file record into database:', err);
        return res.status(500).send('Server error while saving file information');
      }
      res.send('File created successfully');
    });
  });
};

// Read a file
exports.readFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('File not found:', filePath);
        return res.status(404).send('File not found');
      } else {
        console.error('Error reading file:', err);
        return res.status(500).send('Server error while reading file');
      }
    }
    res.send(data);
  });
};

// Update a file
exports.updateFile = (req, res) => {
  const { filename } = req.params;
  const { newFilename } = req.body;
  const oldFilePath = path.join(__dirname, '../uploads', filename);
  const newFilePath = path.join(__dirname, '../uploads', newFilename);

  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      console.error('Error renaming file:', err);
      return res.status(500).send('Server error while renaming file');
    }

    db.query('UPDATE files SET filename = ?, path = ? WHERE filename = ?', [newFilename, newFilePath, filename], (err, result) => {
      if (err) {
        console.error('Error updating file record in database:', err);
        return res.status(500).send('Server error while updating file information');
      }
      res.send('File renamed successfully');
    });
  });
};

// Delete a file
exports.deleteFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file from file system:', err);
      return res.status(500).send('Server error while deleting file from file system');
    }

    db.query('DELETE FROM files WHERE filename = ?', [filename], (err, result) => {
      if (err) {
        console.error('Error deleting file record from database:', err);
        return res.status(500).send('Server error while deleting file record from database');
      }
      res.send('File deleted successfully');
    });
  });
};

// Upload file 
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { originalname, filename, size, mimetype } = req.file;
    const filePath = path.join(__dirname, '../uploads', req.user.id.toString(), filename);

    ensureDirectoryExistence(filePath);

    // Insert file information into the database
    await db.query('INSERT INTO uploads (user_id, filename, path, size, type) VALUES (?, ?, ?, ?, ?)', [
      req.user.id, originalname, filePath, size, mimetype
    ]);

    // Add the file to a processing queue if necessary
    fileQueue.add({ file: filename });

    res.send('File uploaded and queued for processing');
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).send('Server error');
  }
};

// Fetch file list
exports.getFileList = (req, res) => {
  const directoryPath = path.join(__dirname, 'files');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Server error while fetching file list');
    }

    const fileDetails = files.map(filename => {
      const filePath = path.join(directoryPath, filename);
      return { filename, path: filePath };
    });

    res.json(fileDetails);
  });
};

// Fetch all uploaded files for the authenticated user
exports.getUploadedFiles = (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Server error while fetching file list');
    }

    const fileDetails = files.map(filename => {
      const filePath = path.join(directoryPath, filename);
      return { filename, path: filePath };
    });

    res.json(fileDetails);
  });
};