const db = require('../config/database');

class Review {
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM reviews');
      return rows;
    } catch (error) {
      throw new Error(`Gagal mengambil semua review: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
      return rows.length ? rows[0] : null; // Kembalikan null jika tidak ada data
    } catch (error) {
      throw new Error(`Gagal mengambil review dengan id ${id}: ${error.message}`);
    }
  }

  static async create(user_id, book_id, rating, comment) {
    try {
      // Periksa apakah user_id dan book_id ada di database
      const [user] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
      const [book] = await db.query('SELECT id FROM books WHERE id = ?', [book_id]);

      if (user.length === 0) {
        throw new Error(`User dengan id ${user_id} tidak ditemukan`);
      }
      if (book.length === 0) {
        throw new Error(`Buku dengan id ${book_id} tidak ditemukan`);
      }

      const [result] = await db.query(
        'INSERT INTO reviews (user_id, book_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
        [user_id, book_id, rating, comment]
      );

      return result.insertId;
    } catch (error) {
      throw new Error(`Gagal menambahkan review: ${error.message}`);
    }
  }

  static async update(id, rating, comment) {
    try {
      const [result] = await db.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Gagal mengupdate review dengan id ${id}: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Gagal menghapus review dengan id ${id}: ${error.message}`);
    }
  }
}

module.exports = Review;
