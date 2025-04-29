// models/Kado.js
import mongoose from 'mongoose';

const kadoSchema = new mongoose.Schema({
  contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  type: { type: String, enum: ['memberi', 'menerima'], required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  user_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Buat index untuk pencarian lebih cepat
kadoSchema.index({ contact_id: 1, user_id: 1 });

const Kado = mongoose.models.Kado || mongoose.model('Kado', kadoSchema);

export default Kado;