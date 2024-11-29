const express = require('express');
const router = express.Router();
const i18next = require('../config/i18n');

// Middleware to set language based on query parameter
router.use((req, res, next) => {
  const { lang } = req.query;
  i18next.changeLanguage(lang || 'en');
  next();
});

router.get('/translate', (req, res) => {
  const messageKey = req.query.messageKey || 'welcome_message'; 
  const translatedMessage = i18next.t(messageKey);

  res.json({ message: translatedMessage });
});

module.exports = router;
