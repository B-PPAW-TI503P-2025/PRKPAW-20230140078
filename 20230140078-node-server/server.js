 const express = require('express');
 const cors = require('cors'); 
 const app = express();
 const PORT = 3001;
 const bookRoutes = require('./routes/books');
 
 // Middleware
 app.use(cors()); 
 app.use(express.json()); 
 app.use((req, res, next) => {
   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
   next();
 });
 
 app.get('/', (req, res) => {
   res.send('Home Page for API');
 });
 
 app.listen(PORT, () => {
   console.log(`Express server running at http://localhost:${PORT}/`);
 });

app.use('/api/books', bookRoutes);

app.use((req, res, next) => {
    res.status(404).send("Error 404: Endpoint Tidak Ditemukan.");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Terjadi Kesalahan Internal Server (500)",
        error: err.message 
    });
});