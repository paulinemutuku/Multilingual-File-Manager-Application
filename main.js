const express = require('express');
const app = express();
const db = require('./db/db');
const routes = require('./routers/allrouters');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('base64');

app.use(express.json());

const session = require('express-session');
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

db.connectToDb((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Database connection established');
    app.use('/', routes);
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  }
});
