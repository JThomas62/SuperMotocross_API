const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define the path to the riders.json file
const ridersFilePath = path.join(__dirname, 'data', 'riders.json');

// Routes

// Handles GET requests to /riders
app.get('/riders', (req, res) => {
  try {
    // Read the riders.json file
    const data = fs.readFileSync(ridersFilePath, 'utf8');
    
    const riders = JSON.parse(data);
    res.json(riders);
  } catch (err) {
    console.error('Error accessing riders.json:', err);
    res.status(500).json({ error: 'Could not fetch riders data. Check file path.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});