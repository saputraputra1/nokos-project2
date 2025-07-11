import db from '../lib/db.js';
import verify from '../lib/auth.js';
import axios from 'axios';

export default async function handler(req, res) {
  const user = await verify(req, res);
  if (!user) return;

  const { negara, layanan } = req.body;
  const harga = 3000;

  const [rows] = await db.execute('SELECT saldo FROM users WHERE id = ?', [user.id]);
  if (rows[0].saldo < harga) return res.status(400).json({ message: 'Saldo tidak cukup' });

  try {
    const response = await axios.post(
      `https://5sim.net/v1/user/buy/activation/any/${negara}/${layanan}`,
      {},
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODI0OTE4ODUsImlhdCI6MTc1MDk1NTg4NSwicmF5IjoiMWM1MmFjMDM2ZDk0NGI0ODJlNWU1N2NjYjU4ZDU1YjMiLCJzdWIiOjMzMTM1MDZ9.eF5jieu4OUw_2d8urCYCNC3H3H-eMTWQHtnc7rUocr3HI1-r9rWESdDv8tlw6kdCnjvb3fdg8Df9YwGGDl-qrlflAU-ItYmrUKKguIj11_Vfj-U_6rfjlR6AP7uSOAbC2smCy2fw9daOxuVL8wWcltCaAdatYxfhVf3UrHEDrAQcZUgvISqw9QqWpeAswA7_DlaTWPwzfgLWU7B4rookgyqBY-o2DBe1yERrlRyKdiIds54CKJal10KwN4P44ElE7S5ZuI1kXCO-tWpNSkYtp9qEpvk_7k1dpPGtFGmMTGZbPmoWEvGCJwAt55rpXzH7Rnvt_XJi_LnojHcb_0CGxg"
        }
      }
    );
    const nomor = response.data.phone;
    await db.execute(
      'INSERT INTO orders (user_id, provider, nomor, layanan, negara, status, harga) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.id, '5sim', nomor, layanan, negara, 'waiting', harga]
    );
    await db.execute('UPDATE users SET saldo = saldo - ? WHERE id = ?', [harga, user.id]);
    res.status(200).json({ nomor });
  } catch (e) {
    res.status(500).json({ message: 'Gagal request nomor' });
  }
}