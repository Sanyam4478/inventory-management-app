const express = require('express');
const router = express.Router();
const { Supplier } = require('../models');

// ✅ GET all suppliers based on query filter
router.get('/', async (req, res) => {
    const filter = req.query.filter || 'active'; // default to 'active'
    try {
        const suppliers = await Supplier.findAll({ where: { Status: filter } });
        res.render('supplier', { suppliers, filter });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).send('Server error');
    }
});

// ✅ GET suppliers by status (used for frontend toggle with fetch)
router.get('/filter/:status', async (req, res) => {
    const { status } = req.params;
    try {
        const suppliers = await Supplier.findAll({ where: { Status: status } });
        res.json(suppliers);
    } catch (error) {
        console.error('Error filtering suppliers:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ POST - Restore supplier (now used by JS with custom redirect)
router.post('/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Supplier.update(
            { Status: 'active' },
            { where: { Supplier_ID: id } }
        );
        res.status(200).json({ success: true }); // let frontend handle the redirect
    } catch (error) {
        console.error('Error restoring supplier:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ POST - Add supplier (defaults to 'active')
router.post('/add', async (req, res) => {
    const { Supplier_Name, Contact_Number, Email, Address } = req.body;
    try {
        await Supplier.create({
            Supplier_Name,
            Contact_Number,
            Email,
            Address,
            Status: 'active'
        });
        res.redirect('/supplier');
    } catch (error) {
        console.error('Error adding supplier:', error);
        res.status(500).send('Server error');
    }
});

// ✅ POST - Edit supplier (no change to status)
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Supplier_Name, Contact_Number, Email, Address } = req.body;
    try {
        await Supplier.update(
            { Supplier_Name, Contact_Number, Email, Address },
            { where: { Supplier_ID: id } }
        );
        res.redirect('/supplier');
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).send('Server error');
    }
});

// ✅ POST - Soft delete supplier (set status to 'inactive')
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Supplier.update(
            { Status: 'inactive' },
            { where: { Supplier_ID: id } }
        );
        res.redirect('/supplier');
    } catch (error) {
        console.error('Error soft-deleting supplier:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
