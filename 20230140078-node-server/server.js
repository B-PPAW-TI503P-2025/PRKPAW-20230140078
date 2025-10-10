const express = require('express');
const app = express();
const port = 5000; // Port 5000 sesuai panduan praktikum

// Endpoint GET di root ('/')
app.get('/', (req, res) => {
  // Mengembalikan pesan JSON sesuai tugas
  res.json({ message: 'Hello from Server!' }); 
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});