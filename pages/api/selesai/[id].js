// pages/api/selesai/[id].js
import { connectDB } from '../../../lib/db';
import SelesaiStatus from '../../../models/SelesaiStatus';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const { is_selesai } = req.body;
      
      // Cari atau buat status selesai
      const status = await SelesaiStatus.findOneAndUpdate(
        { contact_id: id, user_id: token },
        { is_selesai },
        { 
          new: true,
          upsert: true, // Buat baru jika tidak ada
          setDefaultsOnInsert: true 
        }
      );
      
      return res.status(200).json(status);
    } catch (error) {
      console.error('Error updating selesai status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}