const express = require('express');
const router = express.Router();
const Book = require('../models/books'); // Pastikan path ini benar

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.getAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, published_year } = req.body; // Sesuai dengan format database
    const bookId = await Book.create(title, author, published_year); // Gunakan published_year
    res.status(201).json({ id: bookId, title, author, published_year });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const { title, author, published_year } = req.body; // Pastikan menggunakan published_year
    const updated = await Book.update(req.params.id, title, author, published_year);
    if (!updated) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
