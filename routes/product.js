const express = require('express');
const router = express.Router();
const { Product, Supplier } = require('../models'); // ✅ Sequelize model associations used

// ✅ GET - All products and suppliers (split by active + all)
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Supplier, as: 'supplier' }]
        });

        // ✅ Separate active and all suppliers
        const activeSuppliers = await Supplier.findAll({ where: { Status: 'active' } });
        const allSuppliers = await Supplier.findAll();

        // ✅ Pass both to the view
        res.render('inventory', {
            products,
            activeSuppliers,
            allSuppliers
        });
    } catch (error) {
        console.error('Error fetching products or suppliers:', error);
        res.status(500).send('Server error');
    }
});

// ✅ POST - Add new product
router.post('/add', async (req, res) => {
    const { Product_Name, Category, Price, Stock_Quantity, Reorder_Level, Supplier_ID } = req.body;

    try {
        await Product.create({
            Product_Name,
            Category,
            Price,
            Stock_Quantity,
            Reorder_Level,
            Supplier_ID
        });

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Server error');
    }
});

// ✅ POST - Edit product
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Product_Name, Category, Price, Stock_Quantity, Reorder_Level, Supplier_ID } = req.body;

    try {
        await Product.update({
            Product_Name,
            Category,
            Price,
            Stock_Quantity,
            Reorder_Level,
            Supplier_ID
        }, {
            where: { Product_ID: id }
        });

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Server error');
    }
});

// ✅ POST - Delete product
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Product.destroy({
            where: { Product_ID: id }
        });

        res.redirect('/inventory');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
