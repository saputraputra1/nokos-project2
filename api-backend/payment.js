async function generatePayment(trxId, amount) {
  const dummyURL = `https://dummy-qris.com/pay/${trxId}?amount=${amount}`
  return {
    payment_url: dummyURL,
    qr_image: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dummyURL)}`
  }
}

module.exports = { generatePayment }
