const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});

userSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.error(err);
    return false;
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
