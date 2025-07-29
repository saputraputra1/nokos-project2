const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { generatePayment } = require('./payment')
const { handleNewMessage, sendMessageFromAdmin } = require('../api/chat')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat/newMessage', handleNewMessage)
app.post('/api/chat/sendMessage', sendMessageFromAdmin)

app.get('/api/chat/messages/:user', (req, res) => {
    const user = req.params.user;
    const messagesRef = db.ref(`messages/${user}`);
    messagesRef.once('value', (snapshot) => {
        const messages = snapshot.val();
        res.json(messages ? Object.values(messages) : []);
    });
});

app.get('/api/produk', (req, res) => {
  const data = JSON.parse(fs.readFileSync(__dirname + '/produk.json'))
  res.json(data)
})

app.get('/api/produk/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(__dirname + '/produk.json'))
  const item = data.find(p => p.id === req.params.id)
  if (!item) return res.status(404).json({ message: 'Produk tidak ditemukan' })
  res.json(item)
})

app.post('/api/beli', async (req, res) => {
  const { produkId, nomor } = req.body
  const produkList = JSON.parse(fs.readFileSync(__dirname + '/produk.json'))
  const produk = produkList.find(p => p.id === produkId)
  if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' })

  const transaksiId = 'trx_' + Date.now()
  const transaksi = {
    id: transaksiId,
    produkId,
    nomor,
    harga: produk.harga,
    status: 'pending',
    created_at: new Date().toISOString()
  }

  const trxList = JSON.parse(fs.readFileSync(__dirname + '/transaksi.json'))
  trxList.push(transaksi)
  fs.writeFileSync(__dirname + '/transaksi.json', JSON.stringify(trxList, null, 2))

  const payment = await generatePayment(transaksiId, produk.harga)
  res.json({ ...transaksi, ...payment })
})

app.get('/api/status/:id', (req, res) => {
  const trxList = JSON.parse(fs.readFileSync(__dirname + '/transaksi.json'))
  const trx = trxList.find(t => t.id === req.params.id)
  if (!trx) return res.status(404).json({ message: 'Transaksi tidak ditemukan' })
  res.json(trx)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('✅ Backend berjalan di http://localhost:' + PORT)
})
