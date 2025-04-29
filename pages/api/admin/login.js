import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Verify admin credentials
  if (email !== process.env.ADMIN_EMAIL || 
      password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  try {
    await connectDB();

    // Find or create admin user
    let admin = await User.findOne({ email });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email,
        password_hash: await bcrypt.hash(password, 10),
        isAdmin: true
      });
      await admin.save();
    } else if (!admin.isAdmin) {
      admin.isAdmin = true;
      await admin.save();
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: admin._id },
      process.env.ADMIN_SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Set cookie
    res.setHeader('Set-Cookie', serialize('adminToken', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    }));

    return res.status(200).json({ 
      message: 'Login successful',
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: admin.isAdmin
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}