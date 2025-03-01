require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Import the User model
const User = require('./models/User');

// **User Registration Route**
app.post('/register', async (req, res) => {
  console.log("Received registration request:", req.body);

  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user in MongoDB
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// **User Login Route**
app.post('/login', async (req, res) => {
  console.log("Login attempt:", req.body);

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// **JWT Middleware for Protected Routes**
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// **Get User Profile Route**
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// **Update User Profile Route**
app.put('/profile', authMiddleware, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'transcript', maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      firstName,
      lastName,
      university,
      major,
      race,
      ethnicity,
      gender
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      university,
      major,
      race,
      ethnicity,
      gender
    };

    // Handle file uploads if present
    if (req.files) {
      if (req.files.resume) {
        updateData.resume = {
          data: req.files.resume[0].buffer,
          contentType: req.files.resume[0].mimetype,
          filename: req.files.resume[0].originalname
        };
      }
      if (req.files.transcript) {
        updateData.transcript = {
          data: req.files.transcript[0].buffer,
          contentType: req.files.transcript[0].mimetype,
          filename: req.files.transcript[0].originalname
        };
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        university: user.university,
        major: user.major,
        race: user.race,
        ethnicity: user.ethnicity,
        gender: user.gender,
        hasResume: !!user.resume,
        hasTranscript: !!user.transcript
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// **Server Test Route**
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// **Start Server**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});