// pages/api/contacts/index.js
import { connectDB } from '../../../lib/db';
import Contact from '../../../models/Contact';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    const contacts = await Contact.find({ user_id: token });
    return res.status(200).json(contacts);
  }

  if (req.method === 'POST') {
    const { name, address, relationship } = req.body;
    const contact = await Contact.create({ user_id: token, name, address, relationship });
    return res.status(201).json(contact);
  }

  res.status(405).end();
}
