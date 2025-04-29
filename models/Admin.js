// models/Admin.js
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  secret_key: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);