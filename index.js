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

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('2025 SuperMotocross Riders Season API is running');
});

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

// Handles GET requests to /riders/:id
app.get('/riders/:id', (req, res) => {
  try {
    const data = fs.readFileSync(ridersFilePath, 'utf8');
    const ridersData = JSON.parse(data);
    const id = parseInt(req.params.id);
    
    // Search for rider in both 450 and 250 classes
    const allRiders = [...ridersData['450_riders'], ...ridersData['250_riders'] || []];
    const rider = allRiders.find(r => r.id === id);
    
    if (rider) {
      res.json(rider);
    } else {
      res.status(404).json({ error: 'Rider not found' });
    }
  } catch (err) {
    console.error('Error accessing riders.json:', err);
    res.status(500).json({ error: 'Could not fetch rider data' });
  }
});

// Handles GET requests to /riders/team
app.get('/riders/team/:team', (req, res) => {
  try {
    const data = fs.readFileSync(ridersFilePath, 'utf8');
    const ridersData = JSON.parse(data);
    const teamName = req.params.team;
    
    // Search for riders in both 450 and 250 classes
    const allRiders = [...ridersData['450_riders'], ...ridersData['250_riders'] || []];
    const teamRiders = allRiders.filter(r => 
      r.team.toLowerCase().includes(teamName.toLowerCase())
    );
    
    if (teamRiders.length > 0) {
      res.json(teamRiders);
    } else {
      res.status(404).json({ error: 'No riders found for this team' });
    }
  } catch (err) {
    console.error('Error accessing riders.json:', err);
    res.status(500).json({ error: 'Could not fetch team data' });
  }
});

// Handles GET requests to /riders/class
app.get('/riders/class/:class', (req, res) => {
  try {
    const data = fs.readFileSync(ridersFilePath, 'utf8');
    const ridersData = JSON.parse(data);
    const classParam = req.params.class;
    
    // Check if the requested class exists in the data
    const classKey = `${classParam}_riders`;
    const riders = ridersData[classKey];
    
    if (riders) {
      res.json(riders);
    } else {
      res.status(404).json({ error: 'No riders found for this class' });
    }
  } catch (err) {
    console.error('Error accessing riders.json:', err);
    res.status(500).json({ error: 'Could not fetch class data' });
  }
});

// Handles GET requests to /riders/bike
app.get('/riders/bike/:manufacturer', (req, res) => {
  try {
    const data = fs.readFileSync(ridersFilePath, 'utf8');
    const ridersData = JSON.parse(data);
    const manufacturer = req.params.manufacturer;
    
    // Search for riders in both 450 and 250 classes
    const allRiders = [...ridersData['450_riders'], ...ridersData['250_riders'] || []];
    const bikeRiders = allRiders.filter(r => 
      r.bike.toLowerCase().includes(manufacturer.toLowerCase())
    );
    
    if (bikeRiders.length > 0) {
      res.json(bikeRiders);
    } else {
      res.status(404).json({ error: 'No riders found for this bike manufacturer' });
    }
  } catch (err) {
    console.error('Error accessing riders.json:', err);
    res.status(500).json({ error: 'Could not fetch bike data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});