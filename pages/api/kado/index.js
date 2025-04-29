// pages/api/kado.js
import { connectDB } from '../../../lib/db';
import Kado from '../../../models/Kado';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    try {
      const kados = await Kado.find({ user_id: token });
      return res.status(200).json(kados);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { contact_id, type, description, date } = req.body;
      const newKado = new Kado({
        contact_id,
        type,
        description,
        date,
        user_id: token
      });
      await newKado.save();
      return res.status(201).json(newKado);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create kado' });
    }
  }

  res.status(405).end();
}