const express = require('express');
const app = express();
require('dotenv').config();  // Load environment variables

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');  // Correct path to userRoutes
app.use('/api/users', userRoutes);

// Server
const PORT = process.env.PORT || 3000;  // Use the port from environment variables or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
