const admin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('../api-backend/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://online--suit-default-rtdb.firebaseio.com'
});

const db = admin.database();

// Fungsi untuk menangani pesan baru dari pengguna
const handleNewMessage = async (req, res) => {
  const { message, user } = req.body;

  if (!message || !user) {
    return res.status(400).json({ error: 'Pesan dan pengguna harus diisi' });
  }

  // Simpan pesan ke Firebase
  const messagesRef = db.ref(`messages/${user}`);
  messagesRef.push({
    text: message,
    timestamp: new Date().getTime(),
    sender: 'user'
  });

  res.status(200).json({ success: true });
};

// Fungsi untuk mengirim pesan dari admin
const sendMessageFromAdmin = async (req, res) => {
  const { message, user } = req.body;

  if (!message || !user) {
    return res.status(400).json({ error: 'Pesan dan pengguna harus diisi' });
  }

  // Simpan pesan ke Firebase
  const messagesRef = db.ref(`messages/${user}`);
  messagesRef.push({
    text: message,
    timestamp: new Date().getTime(),
    sender: 'admin'
  });

  res.status(200).json({ success: true });
};

module.exports = {
  handleNewMessage,
  sendMessageFromAdmin
};
