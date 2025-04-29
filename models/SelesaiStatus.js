// models/SelesaiStatus.js
import mongoose from 'mongoose';

const SelesaiStatusSchema = new mongoose.Schema({
  contact_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact',
    required: true,
    unique: true // Pastikan satu kontak hanya punya satu status
  },
  user_id: { 
    type: String, 
    required: true 
  },
  is_selesai: { 
    type: Boolean, 
    default: false 
  },
}, {
  timestamps: true
});

// Buat index untuk pencarian lebih cepat
SelesaiStatusSchema.index({ contact_id: 1, user_id: 1 });

export default mongoose.models.SelesaiStatus || mongoose.model('SelesaiStatus', SelesaiStatusSchema);