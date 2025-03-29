const express = require('express');
const bcrypt = require('bcryptjs'); // For password hashing (future use)
const User = require('../models/user'); // Corrected User model path

const router = express.Router();

// Middleware: Check if user is logged in
const checkAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// GET /login - Render login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /login - Handle login submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { Email: email } });

        if (!user) {
            return res.render('login', { error: 'Invalid email or password.' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.Password_Hash);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password.' });
        }

        // Store user session
        req.session.userId = user.User_ID;
        req.session.role = user.Role;

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login Error:', error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

// GET /dashboard - Render the dashboard (currently empty)
router.get('/dashboard', checkAuth, (req, res) => {
    res.render('dashboard'); // Placeholder for now
});

// POST /logout - Destroy session and redirect to login
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


module.exports = router;
