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

// Scholarship Endpoint: returns top three overlapping scholarships
app.get('/api/scholarships', async (req, res) => {
  try {
    const data = await getScholarships();
    const overlapping = Array.isArray(data.overlapping) ? data.overlapping.slice(0, 3) : [];
    res.json({ overlapping });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scholarship data.' });
  }
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
