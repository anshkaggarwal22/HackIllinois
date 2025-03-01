require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Registration endpoint example
app.post('/register', async (req, res) => {
  // Log the request body to confirm the endpoint is hit
  console.log("POST /register received with body:", req.body);
  
  try {
    const { email, password } = req.body;
    
    // Set the number of salt rounds (trade-off between security and performance)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Here, you'd normally save the user (with the hashed password) to your database.
    // For this example, we'll just return the data as a JSON response.
    res.status(201).json({
      message: 'User registered successfully',
      email,
      hashedPassword,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// A simple test endpoint to verify your server is running
app.get('/', (req, res) => {
  res.send('Backend server is running! YAY!');
});

// Start the server on port 3001 (or use PORT from environment variables)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
