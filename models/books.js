const db = require('../config/database');

class Book {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM books');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(title, author, publishedYear) {
    const [result] = await db.query(
      'INSERT INTO books (title, author, published_year) VALUES (?, ?, ?)',
      [title, author, publishedYear]
    );
    return result.insertId;
  }

  static async update(id, title, author, publishedYear) {
    const [result] = await db.query(
      'UPDATE books SET title = ?, author = ?, published_year = ? WHERE id = ?',
      [title, author, publishedYear, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Book;
