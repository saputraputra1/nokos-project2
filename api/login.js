import db from '../lib/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Login gagal' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.status(200).json({ token });
}