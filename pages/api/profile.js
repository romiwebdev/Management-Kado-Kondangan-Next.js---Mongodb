import { connectDB } from '../../lib/db';
import User from '../../models/User';
import { parse } from 'cookie';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await connectDB();
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Update Profile
    if (req.method === 'PUT') {
      const { name, email, password } = req.body;
      
      const updateData = { name, email };
      if (password) {
        updateData.password_hash = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        token,
        updateData,
        { new: true }
      ).select('-password_hash');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(updatedUser);
    }

    // Delete Profile
    if (req.method === 'DELETE') {
      // Hapus semua data user terkait (kontak, kado, dll)
      // ... tambahkan kode untuk menghapus data terkait ...

      const deletedUser = await User.findByIdAndDelete(token);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Profile API error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
}