const db = require('../config/database');

class Loan {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM loans');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM loans WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async create(user_id, book_id, loan_date, return_date, status) {
        const [result] = await db.execute(
            'INSERT INTO loans (user_id, book_id, loan_date, return_date, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, book_id, loan_date, return_date, status]
        );
        return result.insertId;
    }

    static async update(id, user_id, book_id, loan_date, return_date, status) {
        const [result] = await db.execute(
            'UPDATE loans SET user_id = ?, book_id = ?, loan_date = ?, return_date = ?, status = ? WHERE id = ?',
            [user_id, book_id, loan_date, return_date, status, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM loans WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Loan;
