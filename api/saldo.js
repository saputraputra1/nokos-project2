import db from '../lib/db.js';
import verify from '../lib/auth.js';

export default async function handler(req, res) {
  const user = await verify(req, res);
  if (!user) return;

  const [rows] = await db.execute('SELECT saldo FROM users WHERE id = ?', [user.id]);
  res.status(200).json({ saldo: rows[0].saldo });
}