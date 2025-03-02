import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  state: { type: String, default: "" },
  university: { type: String, default: "" },
  major: { type: String, default: "" },
  gpa: { type: String, default: "" },
  religion: { type: String, default: "" },
  hobbies: { type: String, default: "" },
  race: { type: String, default: "" },
  gender: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('User', userSchema);
