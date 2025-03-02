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
  console.log("atempt:", req.body);

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
  if (!token) {
    console.log('No token provided'); // Debug log
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Ensure this is set correctly
    console.log('Token verified for user:', verified.userId); // Debug log
    next();
  } catch (error) {
    console.error('Token verification failed:', error); // Debug log
    res.status(400).json({ error: 'Invalid token' });
  }
};

// **Protected Route Example**
app.get('/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

// **Update Profile Route**
app.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Updating profile for user:', userId);
    console.log('Received data:', req.body);

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
    
    console.log('Update data being sent to MongoDB:', updateData);

    // Force upsert to ensure all fields are created if they don't exist
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, upsert: true }
    ).select('-password');

    if (!user) {
      console.log('User not found in database:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully:', user);
    console.log('Fields in updated user object:', Object.keys(user.toObject()));

    // Return all fields explicitly
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

// **Server Test Route**
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// **Start Server**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});