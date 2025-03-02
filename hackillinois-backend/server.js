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
import SavedScholarship from './models/SavedScholarship.js';
import { getScholarships } from './scholarship.js';

const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for file uploads if needed
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

/* ================================
   USER REGISTRATION
================================ */
app.post('/register', async (req, res) => {
  console.log("Registration request:", req.body);
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

/* ================================
   USER LOGIN
================================ */
app.post('/login', async (req, res) => {
  console.log("Login request:", req.body);
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

/* ================================
   AUTH MIDDLEWARE
================================ */
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
};

/* ================================
   GET USER PROFILE
================================ */
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/* ================================
   UPDATE USER PROFILE
================================ */
app.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Profile update request body:", req.body);
    const {
      firstName,
      lastName,
      state,
      university,
      major,
      gpa,
      religion,
      hobbies,
      race,
      gender
    } = req.body;
    
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (state !== undefined) updateData.state = state;
    if (university !== undefined) updateData.university = university;
    if (major !== undefined) updateData.major = major;
    if (gpa !== undefined) updateData.gpa = gpa;
    if (religion !== undefined) updateData.religion = religion;
    if (hobbies !== undefined) updateData.hobbies = hobbies;
    if (race !== undefined) updateData.race = race;
    if (gender !== undefined) updateData.gender = gender;
    
    console.log("Update data:", updateData);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

/* ================================
   SCHOLARSHIP ENDPOINT
   Uses the saved profile fields to query ChatGPT
================================ */
app.get('/api/scholarships', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (!user.race || !user.gender || !user.university) {
      return res.json({
        incompleteProfile: true,
        message: 'Please update your profile with race, gender, and university first.'
      });
    }
    
    const data = await getScholarships(user.university, user.race, user.gender);
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch scholarship data:', error);
    res.status(500).json({ error: 'Failed to fetch scholarship data.' });
  }
});

/* ================================
   SAVED SCHOLARSHIPS ENDPOINTS
================================ */
// Save a scholarship for the logged-in user
app.post('/api/savedScholarships', authMiddleware, async (req, res) => {
  try {
    const { title, award_amount, due_date, university, apply_link } = req.body;
    const userId = req.user.userId;
    
    const existing = await SavedScholarship.findOne({ userId, apply_link, title });
    if (existing) {
      return res.status(400).json({ error: 'Scholarship already saved' });
    }
    
    const newSaved = new SavedScholarship({ userId, title, award_amount, due_date, university, apply_link });
    await newSaved.save();
    
    res.status(201).json({ message: 'Scholarship saved', savedScholarship: newSaved });
  } catch (error) {
    console.error('Error saving scholarship:', error);
    res.status(500).json({ error: 'Failed to save scholarship' });
  }
});

// Get all saved scholarships for the logged-in user
app.get('/api/savedScholarships', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const saved = await SavedScholarship.find({ userId });
    res.json({ savedScholarships: saved });
  } catch (error) {
    console.error('Error fetching saved scholarships:', error);
    res.status(500).json({ error: 'Failed to fetch saved scholarships' });
  }
});

// Update a saved scholarship (toggle isSuccessful)
app.put('/api/savedScholarships/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { isSuccessful } = req.body;
    const userId = req.user.userId;
    const updated = await SavedScholarship.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isSuccessful } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json({ message: 'Scholarship updated', savedScholarship: updated });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    res.status(500).json({ error: 'Failed to update scholarship' });
  }
});

// Delete a saved scholarship
app.delete('/api/savedScholarships/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const deleted = await SavedScholarship.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }
    res.json({ message: 'Scholarship deleted' });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    res.status(500).json({ error: 'Failed to delete scholarship' });
  }
});

/* ================================
   TEST ROUTE
================================ */
app.get('/', (req, res) => {
  res.send('Server is running!');
});

/* ================================
   START THE SERVER
================================ */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
