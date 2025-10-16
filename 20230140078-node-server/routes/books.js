 	const express = require('express');
 	const router = express.Router();
 	
 	let books = [
 	  {id: 1, title: 'Book 1', author: 'Author 1'},
 	  {id: 2, title: 'Book 2', author: 'Author 2'}
 	];
 	
 	router.get('/', (req, res) => {
 	  res.json(books);
 	});
 	
 	router.get('/:id', (req, res) => {
 	  const book = books.find(b => b.id === parseInt(req.params.id));
 	  if (!book) return res.status(404).send('Book not found');
 	  res.json(book);
 	});
 	
 	router.post('/', (req, res) => {
 	  const { title, author } = req.body;
 	  if (!title || !author) {
 	      return res.status(400).json({ message: 'Title and author are required' });
 	  }
 	  const book = {
 	    id: books.length + 1,
 	    title,
 	    author
 	  };
 	  books.push(book);
 	  res.status(201).json(book);
 	});
 	
 	module.exports = router;
