import { verifyAdmin } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  const isAdmin = await verifyAdmin(req);
  
  if (!isAdmin) {
    return res.status(401).json({ verified: false });
  }

  return res.status(200).json({ verified: true });
}