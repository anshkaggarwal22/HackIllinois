// models/SavedScholarship.js
import mongoose from 'mongoose';

const savedScholarshipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  award_amount: { type: String, required: true },
  due_date: { type: String, required: true },
  university: { type: String, required: true },
  apply_link: { type: String, required: true },
  isSuccessful: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SavedScholarship', savedScholarshipSchema);
