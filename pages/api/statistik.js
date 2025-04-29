// pages/api/statistik.js
import { connectDB } from '../../lib/db';
import Contact from '../../models/Contact';
import Kado from '../../models/Kado';
import SelesaiStatus from '../../models/SelesaiStatus';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      // Gunakan Promise.all untuk parallel queries
      const [totalContacts, totalKado, selesaiContacts] = await Promise.all([
        Contact.countDocuments({ user_id: token }),
        Kado.countDocuments({ user_id: token }),
        SelesaiStatus.countDocuments({ 
          user_id: token, 
          is_selesai: true 
        })
      ]);

      return res.status(200).json({
        totalContacts,
        totalKado,
        selesaiContacts,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}