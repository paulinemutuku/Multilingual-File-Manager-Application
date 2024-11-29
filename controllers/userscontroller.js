const User = require('../models/user');
const passport = require('../config/passport');
const File = require('../models/files');
const Session = require('../models/session');

exports.createUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const errors = {};
      if (existingUser.username === username) {
        errors[username] = "already exists. Use a different username";
      }
      if (existingUser.email === email) {
        errors[email] = "already exists. Use a different email. Use a different email";
      }
      if (existingUser.username === username && existingUser.email === email) {
        errors[username] = 'already exists. Use a different username and ';
        errors[email] = 'already exists. Use a different email ';
      }
      return res.status(400).json({ errors });
    } else {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      await user.save();
      res.status(201).json({ message: `An account with username ${username}  and email ${email} has been created successfully. Congratulations` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
}

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (req.session.passport) {
    return res.status(401).json({ message: `${username}  you are already logged in` });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }
      const userId = user._id;
      const session = new Session({
        userId: userId,
        cookie: req.session.cookie
      });
      await session.save();

      res.redirect('/getsession');
    });
  })(req, res, next);
}

exports.logoutUser = async (req, res) => {
  try {
    if (!req.session.passport) {
      res.status(401).json({ message: 'You are already logged out. You can log in again' });
      return;
    }
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging out user' });
      } else {
        res.json({ message: 'User logged out successfully' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging out user' });
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting user' });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    if (!req.session.passport) {
      res.status(401).json({ message: 'You must be logged in to delete users' });
      return;
    }
    const userId = req.session.passport.user;
    await File.deleteMany({ owner: userId });
    const result = await User.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
}

exports.deleteAllUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      res.status(404).json({ message: 'No users found' });
    } else {
      await User.deleteMany();
      await File.deleteMany();
      res.status(200).json({ message: 'All users deleted successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting all users' });
  }
}

exports.getSession = async (req, res) => {
  try {
    res.json(req.session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting session' });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting users' });
  }
}
