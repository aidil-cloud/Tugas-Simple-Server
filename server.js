const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xssFilter = require('xss'); // pake xss untuk sanitize string

const app = express();
const port = 3000;

app.use(helmet());
app.use(express.json());
// jangan gunakan xss-clean karena bermasalah di beberapa versi

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak request dari IP ini. Coba lagi nanti.' }
});
app.use(limiter);

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  const expected = 'Bearer secret123';
  if (!auth || auth !== expected) {
    console.warn(`[AUTH] Unauthorized access attempt from ${req.ip} to ${req.originalUrl}`);
    return res.status(403).json({ error: 'Unauthorized access!' });
  }
  next();
}

app.get('/', (req, res) => {
  res.send('Haloooo Selamat datang di server Express Aidil (secure)');
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello dari GET API (aman)!' });
});

app.post('/api/data', authMiddleware, (req, res) => {
  const body = req.body || {};

  // Sanitasi menggunakan xss untuk semua field string
  if (body.username && typeof body.username === 'string') {
    body.username = xssFilter(body.username);
  }

  // validasi sederhana
  if ('username' in body) {
    if (typeof body.username !== 'string' || /['";\-]/.test(body.username)) {
      console.warn('[SEC] SQL injection / invalid username detected:', body.username);
      return res.status(400).json({ error: 'Input tidak valid / terdeteksi SQL injection attempt' });
    }
  }

  if ('nilai' in body) {
    if (typeof body.nilai !== 'number') {
      return res.status(400).json({ error: 'Field "nilai" harus berupa number' });
    }
  }

  console.log('Received POST body:', body);
  res.json({ message: 'Data received (secure)!', data: body });
});

app.delete('/api/delete/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  if (!/^\d+$/.test(id)) {
    console.warn('[SEC] Invalid delete id format:', id);
    return res.status(400).json({ error: 'Invalid ID format!' });
  }

  console.log(`Request DELETE diterima untuk id: ${id}`);
  res.json({ message: `Data dengan id ${id} berhasil dihapus (secure).` });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
