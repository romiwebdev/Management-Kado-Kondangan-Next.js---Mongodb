// pages/api/me.js
import { connectDB } from '../../lib/db';
import User from '../../models/User';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  
  // Hanya izinkan method GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const user = await User.findById(token).select('-password_hash');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    return res.status(200).json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error in /api/me:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}