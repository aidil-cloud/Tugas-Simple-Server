
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


function bodySqlDetector(req, res, next) {

  if ((req.method === 'POST' || req.method === 'DELETE') && req.body) {
    const bodyString = JSON.stringify(req.body);

    if (/('|;|--)/.test(bodyString)) {
      console.log(`[SEC] SQL injection / invalid input detected: ${bodyString}`);
      return res.status(400).json({ error: "Input tidak valid / terdeteksi SQL injection attempt" });
    }
  }
  next();
}


function validateIdParam(req, res, next) {
  if (req.params && req.params.id) {
    if (!/^\d+$/.test(String(req.params.id))) {
      return res.status(400).json({ message: 'Invalid id parameter' });
    }
  }
  next();
}


function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (token === 'tokenrahasia') {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}


app.use(bodySqlDetector);


app.get('/', (req, res) => res.send(`Congratulations! Server running on port ${port}`));
app.get('/dummy-get', (req, res) => res.json({ message: 'This is a dummy GET API' }));

app.post('/dummy-post', authMiddleware, (req, res) => {
  const { body } = req;
  console.log('Received body:', body);
  res.json({ message: `This is a dummy POST API, you sent: ${JSON.stringify(body)}` });
});

app.delete('/dummy-delete/:id', authMiddleware, validateIdParam, (req, res) => {
  const { id } = req.params;
  res.json({ message: `This is a dummy DELETE API. Item with id ${id} has been deleted (simulated).` });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));