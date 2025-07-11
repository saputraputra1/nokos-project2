import db from '../lib/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);
  res.status(200).json({ message: 'Register success' });
}