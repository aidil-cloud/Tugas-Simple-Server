// encryptServer.js
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON body
app.use(express.json());

// Baca Public Key dari file
const publicKey = fs.readFileSync('public.pem', 'utf8');

// Fungsi Enkripsi
function encryptData(plaintext) {
    try {
        const encrypted = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            // Plaintext harus diubah menjadi Buffer
            Buffer.from(plaintext)
        );
        // Kembalikan data terenkripsi dalam format base64
        return encrypted.toString('base64');
    } catch (error) {
        console.error('Encryption Error:', error);
        return null;
    }
}

// Endpoint POST untuk Enkripsi
app.post('/encrypt', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Body harus menyertakan "message".' });
    }

    const encryptedMessage = encryptData(message);

    if (encryptedMessage) {
        res.json({
            originalMessage: message,
            encryptedMessage: encryptedMessage,
            notes: 'Kirimkan encryptedMessage ini ke server dekripsi di port 3001.'
        });
    } else {
        res.status(500).json({ error: 'Gagal melakukan enkripsi.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server Enkripsi berjalan di http://localhost:${PORT}`);
    console.log(`Endpoint: POST http://localhost:${PORT}/encrypt`);
});