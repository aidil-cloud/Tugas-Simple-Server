// decryptServer.js
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = 3001; // Port berbeda dari server enkripsi

// Middleware untuk parsing JSON body
app.use(express.json());

// Baca Private Key dari file
const privateKey = fs.readFileSync('private.pem', 'utf8');

// Fungsi Dekripsi
function decryptData(encryptedBase64) {
    try {
        // Data terenkripsi harus diubah dari base64 ke Buffer
        const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');

        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            encryptedBuffer
        );
        // Kembalikan data dekripsi dalam format string UTF-8
        return decrypted.toString('utf8');
    } catch (error) {
        console.error('Decryption Error:', error);
        return null;
    }
}

// Endpoint POST untuk Dekripsi
app.post('/decrypt', (req, res) => {
    const { encryptedMessage } = req.body;

    if (!encryptedMessage) {
        return res.status(400).json({ error: 'Body harus menyertakan "encryptedMessage".' });
    }

    const decryptedMessage = decryptData(encryptedMessage);

    if (decryptedMessage) {
        res.json({
            encryptedMessage: encryptedMessage,
            decryptedMessage: decryptedMessage,
            status: 'Dekripsi Berhasil'
        });
    } else {
        res.status(500).json({ error: 'Gagal melakukan dekripsi. Mungkin Private Key salah atau data rusak.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server Dekripsi berjalan di http://localhost:${PORT}`);
    console.log(`Endpoint: POST http://localhost:${PORT}/decrypt`);
});