// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from './models/User.js';


// Set up Express
const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Import the User model (ensure your User model file is in ./models/User.js)

// User Registration Route
app.post('/register', async (req, res) => {
  console.log("Received registration request:", req.body);
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  console.log("Attempt:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// JWT Middleware for Protected Routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log('Token verified for user:', verified.userId);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Protected Profile Route
app.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

// Update Profile Route
app.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Updating profile for user:', userId);
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      state: req.body.state,
      university: req.body.university,
      major: req.body.major,
      gpa: req.body.gpa,
      religion: req.body.religion,
      hobbies: req.body.hobbies,
      race: req.body.race,
      gender: req.body.gender
    };
    const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select('-password');
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        state: user.state || '',
        university: user.university || '',
        major: user.major || '',
        gpa: user.gpa || '',
        religion: user.religion || '',
        hobbies: user.hobbies || '',
        race: user.race || '',
        gender: user.gender || ''
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Import the scholarship search function
import { getScholarships } from './scholarship.js';

// Scholarship Endpoint: returns personalized scholarships based on user profile
app.get('/api/scholarships', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching user profile for personalized scholarships...');
    const userId = req.user.userId;
    
    // Fetch the user's profile from MongoDB
    const user = await User.findById(userId).select('-password');
    if (!user) {
      console.error('User not found for personalized scholarships');
      return res.status(404).json({
        error: 'User not found',
        overlapping: []
      });
    }
    
    console.log('Fetching personalized scholarships for user:', user.email);
    const data = await getScholarships(user);
    
    if (!data || !data.overlapping) {
      console.error('Invalid scholarship data returned:', data);
      return res.status(500).json({ 
        error: 'Invalid scholarship data structure', 
        overlapping: [] 
      });
    }
    
    // Take the top 3 overlapping scholarships or all if less than 3
    const overlapping = Array.isArray(data.overlapping) 
      ? data.overlapping.slice(0, Math.min(data.overlapping.length, 3)) 
      : [];
    
    console.log(`Returning ${overlapping.length} personalized scholarships for ${user.email}`);
    res.json({ overlapping });
  } catch (error) {
    console.error('Failed to fetch personalized scholarships:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scholarship data.', 
      message: error.message,
      overlapping: [] 
    });
  }
});

// Non-authenticated fallback scholarship endpoint (for users who aren't logged in)
app.get('/api/default-scholarships', async (req, res) => {
  try {
    console.log('Fetching default scholarships (no user profile)');
    const data = await getScholarships();
    
    if (!data || !data.overlapping) {
      console.error('Invalid scholarship data returned:', data);
      return res.status(500).json({ 
        error: 'Invalid scholarship data structure', 
        overlapping: [] 
      });
    }
    
    // Take the top 3 overlapping scholarships or all if less than 3
    const overlapping = Array.isArray(data.overlapping) 
      ? data.overlapping.slice(0, Math.min(data.overlapping.length, 3)) 
      : [];
    
    console.log(`Returning ${overlapping.length} default scholarships`);
    res.json({ overlapping });
  } catch (error) {
    console.error('Failed to fetch default scholarship data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch scholarship data.', 
      message: error.message,
      overlapping: [] 
    });
  }
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
