const express = require('express');
const router = express.Router();

// Data buku sementara (penyimpanan data sementara)
let books = [
  {id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald'},
  {id: 2, title: 'Moby Dick', author: 'Herman Melville'}
];

// Helper function untuk validasi input
const validateBookInput = (title, author) => {
    return title && author && title.trim() !== '' && author.trim() !== '';
};

// 1. GET ALL (Read All)
router.get('/', (req, res) => {
  res.json(books);
});

// 2. GET BY ID (Read by ID)
router.get('/:id', (req, res, next) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  
  if (!book) {
    // Jika tidak ditemukan, buat error 404 agar ditangani oleh global error handler
    const error = new Error('Book not found');
    error.status = 404;
    return next(error);
  }
  res.json(book);
});

// 3. POST (Create)
router.post('/', (req, res) => {
  const { title, author } = req.body;
  
  // Implementasi Validasi Input (Persyaratan Tugas)
  if (!validateBookInput(title, author)) {
      return res.status(400).json({ message: 'Title and author are required and cannot be empty.' });
  }
  
  const book = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1, // Logika ID unik
    title: title.trim(),
    author: author.trim()
  };
  
  books.push(book);
  res.status(201).json(book); // 201 Created
});

// 4. PUT (Update)
router.put('/:id', (req, res, next) => {
    const { title, author } = req.body;
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    
    // Cek keberadaan buku
    if (bookIndex === -1) {
        const error = new Error('Book not found for update');
        error.status = 404;
        return next(error);
    }
    
    // Implementasi Validasi Input (Persyaratan Tugas)
    if (!validateBookInput(title, author)) {
        return res.status(400).json({ message: 'Title and author are required for update and cannot be empty.' });
    }

    // Lakukan Update
    books[bookIndex].title = title.trim();
    books[bookIndex].author = author.trim();
    
    res.json(books[bookIndex]);
});

// 5. DELETE (Delete)
router.delete('/:id', (req, res, next) => {
    const initialLength = books.length;
    // Filter array, menghilangkan buku dengan ID yang sesuai
    books = books.filter(b => b.id !== parseInt(req.params.id));

    // Cek apakah ada buku yang terhapus (panjang array berkurang)
    if (books.length === initialLength) {
        const error = new Error('Book not found for deletion');
        error.status = 404;
        return next(error);
    }

    res.status(204).send(); // 204 No Content - Sukses, tapi tidak ada body respons
});

module.exports = router;
