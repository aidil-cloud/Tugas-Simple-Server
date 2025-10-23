// Demo-DDoS (Tanpa Proteksi)

const express = require('express');
const app = express();
const PORT = 3000;

// Ini adalah "penampung" yang akan membuat RAM kita penuh
const memoryHog = [];

// Fungsi untuk membuat data sampah (sekitar 1MB)
function createLargeData() {
  // Membuat string besar sekitar 1MB
  return 'x'.repeat(1024 * 1024); 
}

app.get('/', (req, res) => {
  try {
    const largeData = createLargeData();
    // SETIAP request akan menambah 1MB ke array global
    memoryHog.push(largeData);
    
    // Kita kirim balasan yang memberi tahu berapa total memori yang dipakai
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    res.send(`Data diterima! Total memori terpakai: ${memoryUsage.toFixed(2)} MB`);
  
  } catch (error) {
    res.status(500).send("Server kehabisan memori!");
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('Amati kolom "Memory" pada node.exe di Task Manager.');
});