require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors()); // Aktifkan CORS agar bisa diakses dari frontend
app.use(express.json()); // Middleware untuk membaca JSON dari request body
app.use(morgan('dev')); // Logging request (opsional)

// Import routes
const categoriesRouter = require('./routes/categories');
const loansRouter = require('./routes/loans');
const usersRouter = require('./routes/users');
const booksRoutes = require('./routes/books');
const reviewsRoutes = require('./routes/reviews');

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/loans', loansRouter);
app.use('/api/users', usersRouter);
app.use('/api/books', booksRoutes);
app.use('/api/reviews', reviewsRoutes);

// Middleware untuk menangani 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler middleware yang lebih aman
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
