// models/Contact.js
import mongoose from 'mongoose';
import Kado from './Kado';
import SelesaiStatus from './SelesaiStatus';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  relationship: { type: String, required: true },
  user_id: { type: String, required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Tambahkan virtual untuk status selesai
ContactSchema.virtual('selesaiStatus', {
  ref: 'SelesaiStatus',
  localField: '_id',
  foreignField: 'contact_id',
  justOne: true
});

// Middleware untuk cascade delete
ContactSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const contactId = this._id;
  
  try {
    // Hapus semua kado terkait
    await Kado.deleteMany({ contact_id: contactId });
    
    // Hapus status selesai terkait
    await SelesaiStatus.deleteOne({ contact_id: contactId });
    
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
