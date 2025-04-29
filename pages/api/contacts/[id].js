// pages/api/contacts/[id].js
import { connectDB } from '../../../lib/db';
import Contact from '../../../models/Contact';
import Kado from '../../../models/Kado';
import SelesaiStatus from '../../../models/SelesaiStatus';
import { parse } from 'cookie';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'PUT') {
    const { name, address, relationship } = req.body;
    const contact = await Contact.findOneAndUpdate({ _id: id, user_id: token }, { name, address, relationship }, { new: true });
    return res.status(200).json(contact);
  }

  if (req.method === 'DELETE') {
    try {
      // Hapus semua kado terkait kontak ini
      await Kado.deleteMany({ contact_id: id, user_id: token });
      
      // Hapus status selesai terkait kontak ini
      await SelesaiStatus.deleteOne({ contact_id: id, user_id: token });
      
      // Hapus kontak itu sendiri
      const deletedContact = await Contact.findOneAndDelete({ _id: id, user_id: token });
      
      if (!deletedContact) {
        return res.status(404).json({ message: 'Kontak tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Kontak dan data terkait berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      return res.status(500).json({ message: 'Gagal menghapus kontak' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
