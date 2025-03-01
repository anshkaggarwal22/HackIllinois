require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { })
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

const app = express();
app.use(express.json());
app.use(cors());

// Import the User model
const User = require('./models/User');

// Registration endpoint example
app.post('/register', async (req, res) => {
  console.log("POST /register received with body:", req.body);
  
  try {
    const { email, password } = req.body;
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create a new user instance using the User model
    const newUser = new User({
      email,
      password: hashedPassword
    });
    
    // Save the user to MongoDB
    await newUser.save();
    
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
