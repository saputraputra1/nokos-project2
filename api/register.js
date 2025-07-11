import db from '../../lib/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validasi dasar
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash]);

    return res.status(200).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Gagal register' });
  }
}
