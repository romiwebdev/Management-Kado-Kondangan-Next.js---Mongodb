import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import { verifyAdmin } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  await connectDB();

  // Verifikasi admin
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    // Get all users
    if (req.method === 'GET') {
      const users = await User.find({}).select('-password_hash');
      return res.status(200).json(users);
    }

    // Create new user
    if (req.method === 'POST') {
      const { name, email, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const newUser = new User({
        name,
        email,
        password_hash: await bcrypt.hash(password, 10)
      });

      await newUser.save();
      return res.status(201).json({ 
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Admin users API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}