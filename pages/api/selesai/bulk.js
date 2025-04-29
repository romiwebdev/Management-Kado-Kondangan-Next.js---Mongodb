// pages/api/selesai/bulk.js
import { connectDB } from '../../../lib/db';
import SelesaiStatus from '../../../models/SelesaiStatus';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { contact_ids } = req.body;
      
      const statuses = await SelesaiStatus.find({
        contact_id: { $in: contact_ids },
        user_id: token
      });
      
      return res.status(200).json(statuses);
    } catch (error) {
      console.error('Error fetching bulk selesai status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}