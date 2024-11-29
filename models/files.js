const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  size: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: Date,
  fileData: Buffer
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
