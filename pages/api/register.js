// pages/api/register.js
import { connectDB } from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password } = req.body;

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const newUser = await User.create({ name, email, password_hash });

  res.status(201).json({ message: 'User berhasil dibuat', user: { id: newUser._id, name: newUser.name } });
}
