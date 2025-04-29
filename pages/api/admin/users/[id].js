// pages/api/users/[id].js
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';
import Contact from '../../../../models/Contact';
import Kado from '../../../../models/Kado';
import SelesaiStatus from '../../../../models/SelesaiStatus';
import { verifyAdmin } from '../../../../middleware/adminAuth';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();

  // Verifikasi admin
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.query;

  try {
    // Get user by ID
    if (req.method === 'GET') {
      const user = await User.findById(id).select('-password_hash');
      if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }
      return res.status(200).json(user);
    }

    // Update user
    if (req.method === 'PUT') {
      const { name, email, password } = req.body;
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }

      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      
      if (password) {
        user.password_hash = await bcrypt.hash(password, 10);
      }

      await user.save();
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    }

    // Delete user
    if (req.method === 'DELETE') {
      if (id === req.userId) {
        return res.status(400).json({ message: 'Cannot delete yourself' });
      }

      const deletedUser  = await User.findByIdAndDelete(id);
      if (!deletedUser ) {
        return res.status(404).json({ message: 'User  not found' });
      }

      // Hapus semua data terkait user ini (kontak, kado, dll)
      await Contact.deleteMany({ user_id: id });
      await Kado.deleteMany({ user_id: id });
      await SelesaiStatus.deleteMany({ user_id: id });

      return res.status(200).json({ message: 'User  and related data deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Admin user API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}