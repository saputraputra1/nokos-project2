import verify from '../lib/auth.js';

// In-memory store for spins. In a real app, you'd use a database.
const userSpins = new Map();

export default async function handler(req, res) {
  const user = await verify(req, res);
  if (!user) return;

  // For now, we'll assume the user is eligible to spin.
  // In a real app, you would check if the user has purchased a "super" quality product.
  const isEligible = true;

  if (!isEligible) {
    return res.status(403).json({ message: 'Anda tidak berhak untuk memutar.' });
  }

  if (userSpins.has(user.id)) {
    return res.status(403).json({ message: 'Anda sudah pernah memutar.' });
  }

  const prizes = [
    { text: 'Nokos Indo (biasa)', percentage: 0.4 },
    { text: 'Nokos Filipina (premium)', percentage: 0.3 },
    { text: 'Nokos Telegram Indonesia', percentage: 0.2 },
    { text: 'Nokos Telegram+WhatsApp (Indonesia)', percentage: 0.09 },
    { text: 'Nokos Filipina+Indonesia+Kenya', percentage: 0.01 }
  ];

  const random = Math.random();
  let cumulativePercentage = 0;
  let selectedPrize = prizes[prizes.length - 1];

  for (const prize of prizes) {
    cumulativePercentage += prize.percentage;
    if (random < cumulativePercentage) {
      selectedPrize = prize;
      break;
    }
  }

  userSpins.set(user.id, true);

  res.status(200).json({ prize: selectedPrize.text });
}
