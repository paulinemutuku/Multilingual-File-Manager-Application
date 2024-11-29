const multer = require('multer');
const mongoose = require('mongoose');
const User = require('../models/user');

const upload = multer({ dest: './uploads/' });

const File = require('../models/files');

exports.uploadFile = async (req, res) => {
  try {
    upload.any()(req, res, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading file' });
      } else {
        if (!req.session.passport) {
          res.status(401).json({ message: 'You must be logged in to upload files' });
          return;
        }
        const userId = req.session.passport.user;
        console.log(userId);

        if (req.files && req.files.length > 0) {
          const file = req.files[0];
          const fileDoc = new File({
            name: file.originalname,
            path: file.path,
            size: file.size,
            type: file.mimetype,
            userId: userId,
            owner: userId
          });
          try {
            await fileDoc.save();
            await User.findByIdAndUpdate(userId, { $push: { files: fileDoc._id } });
            res.json({ message: 'File uploaded successfully' });
          } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error saving file to database' });
          }
        } else {
          res.status(400).json({ message: 'No file uploaded' });
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file' });
  }
}

exports.allFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting files' });
  }
}

exports.userFiles = async (req, res) => {
  try {
    if (!req.session.passport) {
      res.status(401).json({ message: 'You must be logged in to view your files' });
      return;
    } else {
      const userId = req.session.passport.user;
      const files = await File.find({ owner: userId });
      res.json(files);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting user files' });
  }
}

exports.deleteFile = async (req, res) => {
  try {
    if (!req.session.passport) {
      res.status(401).json({ message: 'You must be logged in to delete files' });
      return;
    }
    const userId = req.session.passport.user;
    const fileId = req.params.id;
    const result = await File.deleteOne({ _id: fileId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'File not found' });
      return;
    } else if (result.deletedCount === 1) {
      await User.findByIdAndUpdate(userId, { $pull: { files: fileId } });
      res.status(200).json({ message: 'File deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting file' });
  }
}

exports.deleteAllFiles = async (req, res) => {
  try {
    const count = await File.countDocuments();
    if (count === 0) {
      res.status(404).json({ message: 'No files found' });
    } else {
      await File.deleteMany();
      await User.updateMany({}, { $set: { files: [] } });
      res.status(200).json({ message: 'All files deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting all files' });
  }
}
