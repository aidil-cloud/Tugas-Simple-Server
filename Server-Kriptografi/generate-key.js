// generateKeys.js
const crypto = require('crypto');
const fs = require('fs');

function generateKeyPair() {
    // Generate asymmetric RSA key pair
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // Ukuran kunci, 2048 bit adalah standar yang baik
        publicKeyEncoding: {
            type: 'spki', // Format Public Key Infrastructure
            format: 'pem' // Format yang umum digunakan untuk sertifikat dan kunci
        },
        privateKeyEncoding: {
            type: 'pkcs8', // Format Public-Key Cryptography Standards #8
            format: 'pem'
            // Di lingkungan produksi, Private Key HARUS dienkripsi
            // cipher: 'aes-256-cbc',
            // passphrase: 'ganti_dengan_passphrase_yang_kuat'
        }
    });

    // Save keys to files (for demonstration)
    fs.writeFileSync('public.pem', keyPair.publicKey);
    fs.writeFileSync('private.pem', keyPair.privateKey);

    console.log('Key pair RSA berhasil dibuat:');
    console.log('public.pem');
    console.log('private.pem');
}

generateKeyPair();