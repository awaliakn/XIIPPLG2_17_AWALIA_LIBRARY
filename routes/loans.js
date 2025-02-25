const express = require('express');
const Loan = require('../models/loans'); // Pastikan model sudah benar
const router = express.Router();

/**
 * Fungsi untuk validasi input loan
 */
function validateLoanInput(req, res) {
    const { user_id, book_id, loan_date, return_date, status } = req.body;

    if (!user_id || !book_id || !loan_date || !return_date || !status) {
        return { error: 'All fields are required' };
    }

    if (typeof user_id !== 'number' || typeof book_id !== 'number' || typeof status !== 'string') {
        return { error: 'Invalid input types' };
    }

    const validStatuses = ['borrowed', 'returned'];
    if (!validStatuses.includes(status)) {
        return { error: 'Invalid status value' };
    }

    return { user_id, book_id, loan_date, return_date, status };
}

// Get all loans
router.get('/', async (req, res) => {
    try {
        const loans = await Loan.getAll();
        res.json(loans);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to fetch loans' });
    }
});

// Get loan by ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const loan = await Loan.getById(id);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        res.json(loan);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to fetch loan' });
    }
});

// Create new loan
router.post('/', async (req, res) => {
    const validation = validateLoanInput(req, res);
    if (validation.error) return res.status(400).json({ message: validation.error });

    try {
        const { user_id, book_id, loan_date, return_date, status } = validation;
        const loanId = await Loan.create(user_id, book_id, loan_date, return_date, status);

        res.status(201).json({ id: loanId, message: 'Loan created successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to create loan' });
    }
});

// Update loan
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    const validation = validateLoanInput(req, res);
    if (validation.error) return res.status(400).json({ message: validation.error });

    try {
        const { user_id, book_id, loan_date, return_date, status } = validation;
        const updatedLoan = await Loan.update(id, user_id, book_id, loan_date, return_date, status);

        if (!updatedLoan) return res.status(404).json({ message: 'Loan not found' });

        res.json({ message: 'Loan updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to update loan' });
    }
});

// Delete loan
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedLoan = await Loan.delete(id);
        if (!deletedLoan) return res.status(404).json({ message: 'Loan not found' });

        res.json({ message: 'Loan deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to delete loan' });
    }
});

module.exports = router;
