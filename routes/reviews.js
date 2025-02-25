const express = require('express');
const router = express.Router();
const Review = require('../models/reviews');

// GET semua review
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.getAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: `Gagal mengambil semua review: ${error.message}` });
  }
});

// GET review berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID review tidak valid' });
    }

    const review = await Review.getById(id);
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ message: 'Review tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ error: `Gagal mengambil review: ${error.message}` });
  }
});

// POST tambah review baru
router.post('/', async (req, res) => {
  try {
    const { user_id, book_id, rating, comment } = req.body;

    // Validasi input
    if (!user_id || !book_id || rating === undefined || !comment) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating harus berupa angka antara 1-5' });
    }

    // Tambahkan review
    const reviewId = await Review.create(user_id, book_id, rating, comment);
    res.status(201).json({ message: 'Review berhasil ditambahkan', id: reviewId });

  } catch (error) {
    res.status(500).json({ error: `Gagal menambahkan review: ${error.message}` });
  }
});

// PUT update review berdasarkan ID
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID review tidak valid' });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating harus berupa angka antara 1-5' });
    }

    const updated = await Review.update(id, rating, comment);
    if (updated) {
      res.json({ message: 'Review berhasil diperbarui' });
    } else {
      res.status(404).json({ message: 'Review tidak ditemukan atau tidak ada perubahan' });
    }
  } catch (error) {
    res.status(500).json({ error: `Gagal mengupdate review: ${error.message}` });
  }
});

// DELETE hapus review berdasarkan ID
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID review tidak valid' });
    }

    const deleted = await Review.delete(id);
    if (deleted) {
      res.json({ message: 'Review berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Review tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ error: `Gagal menghapus review: ${error.message}` });
  }
});

module.exports = router;
