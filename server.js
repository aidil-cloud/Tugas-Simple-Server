// Kodingan ASLI by AIDIL and AI

const express = require('express');
const app = express();
const port = 3000; // bisa pakai 80 juga, tapi 3000 lebih aman di lokal

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Haloooo Selamat datang di server Express Aidil');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello dari GET API!' });
});

app.post('/api/data', (req, res) => {
  const { body } = req;
  console.log('Received POST body:', body);
  res.json({ message: 'Data received!', data: body });
});

app.delete('/api/delete/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Request DELETE diterima untuk id: ${id}`);
  res.json({ message: `Data dengan id ${id} berhasil dihapus.` });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
