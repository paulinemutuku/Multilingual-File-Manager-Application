const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');  // Correctly require db.js from the db folder
const router = express.Router();

// Route for User Registration
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  // Validate input
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error.' });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error hashing password.' });
      }

      // Insert the user into the database
      const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
      db.query(sql, [username, hashedPassword, email], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error saving user.' });
        }
        return res.status(201).json({ message: 'User registered successfully.' });
      });
    });
  });
});

module.exports = router;
