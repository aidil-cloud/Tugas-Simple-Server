// Demo-DDoS (DENGAN Proteksi)

const express = require('express');
const rateLimit = require('express-rate-limit'); // Tambah ini
const app = express();
const PORT = 3000;

// Konfigurasi Rate Limiter (SAMA PERSIS)
const limiter = rateLimit({
  windowMs: 1 * 20 * 1000, // 20 detik
  max: 50, // maksimum 50 request per windowMs
  message: 'Terlalu banyak request',
});

// Terapkan limiter SEBELUM route utama
app.use(limiter); // Tambah ini

// --- Sisa kode SAMA PERSIS seperti sebelumnya ---

const memoryHog = [];

function createLargeData() {
  return 'x'.repeat(1024 * 1024); 
}

app.get('/', (req, res) => {
  try {
    const largeData = createLargeData();
    memoryHog.push(largeData);

    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    res.send(`Data diterima! Total memori terpakai: ${memoryUsage.toFixed(2)} MB`);

  } catch (error) {
    res.status(500).send("Server kehabisan memori!");
  }
});

app.listen(PORT, () => {
  console.log(`Server (RAM Terproteksi) berjalan di http://localhost:${PORT}`);
});