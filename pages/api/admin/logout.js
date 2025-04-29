import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', serialize('adminToken', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  }));

  return res.status(200).json({ message: 'Logout successful' });
}