// pages/api/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', serialize('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0), // Set expired
  }));

  return res.status(200).json({ message: 'Logout berhasil' });
}