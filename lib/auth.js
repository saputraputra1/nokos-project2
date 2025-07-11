import jwt from 'jsonwebtoken';

export default async function verify(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch {
    res.status(403).json({ message: 'Forbidden' });
    return null;
  }
}