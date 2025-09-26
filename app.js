const express = require('express')
const path = require('path') // Modul 'path' diperlukan untuk menentukan jalur file
const app = express()
const port = 3000

// 1. Setup Middleware untuk File Statis
// Ini memberitahu Express untuk melayani semua file di folder 'public'
// Misalnya: file 'style.css' sekarang bisa diakses di '/style.css'
app.use(express.static(path.join(__dirname, 'public')))

// 2. Definisi Route Utama
app.get('/', (req, res) => {
    // res.send diganti dengan res.sendFile untuk mengirimkan file HTML
    // __dirname adalah direktori folder proyek saat ini
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`)
})