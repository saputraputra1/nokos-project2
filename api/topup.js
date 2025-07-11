import db from '../lib/db.js';
import verify from '../lib/auth.js';

export default async function handler(req, res) {
  const user = await verify(req, res);
  if (!user) return;

  const { jumlah } = req.body;
  await db.execute('UPDATE users SET saldo = saldo + ? WHERE id = ?', [jumlah, user.id]);
  res.status(200).json({ message: 'Topup berhasil' });
}