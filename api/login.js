import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { userId, nama, wa } = req.body;

  if (!userId || !nama || !wa) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const user = {
    id: userId,
    nama,
    wa,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(200).json({ token });
}
