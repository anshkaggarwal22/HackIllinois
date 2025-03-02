// User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  race: String,
  gender: String,
  state: String,
  university: String,
  major: String,
  gpa: String,
  religion: String,
  hobbies: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create the model
const User = mongoose.model('User', userSchema);

// Export as the default export (and remove any extra exports)
export default User;

