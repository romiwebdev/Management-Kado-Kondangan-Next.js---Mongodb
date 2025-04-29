// pages/api/kado/[id].js
import { connectDB } from '../../../lib/db';
import Kado from '../../../models/Kado';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'PUT') {
    const { contact_id, type, description, date } = req.body;
    const kado = await Kado.findOneAndUpdate({ _id: id, user_id: token }, { contact_id, type, description, date }, { new: true });
    return res.status(200).json(kado);
  }

  if (req.method === 'DELETE') {
    await Kado.findOneAndDelete({ _id: id, user_id: token });
    return res.status(200).json({ message: 'Deleted' });
  }

  res.status(405).end();
}
