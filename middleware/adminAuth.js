import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export async function verifyAdmin(req) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.adminToken;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    const admin = await User.findOne({ 
      _id: decoded.userId,
      email: process.env.ADMIN_EMAIL,
      isAdmin: true
    });

    if (!admin) {
      return false;
    }

    // Attach user ID to request
    req.userId = decoded.userId;
    return true;
  } catch (error) {
    console.error('Admin auth error:', error);
    return false;
  }
}