const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./config/database'); // Database connection

const authRoutes = require('./routes/auth');      // Authentication routes
const productRoutes = require('./routes/product'); // Inventory routes
const supplierRoutes = require('./routes/supplier'); // ✅ Supplier routes

// Optional bcrypt password hashing utility
/*
const bcrypt = require('bcryptjs');
async function generateHashedPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed Password:', hashedPassword);
}
generateHashedPassword('Asdf@1234');
*/

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Global session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Route registrations
app.use('/', authRoutes);
app.use('/inventory', productRoutes);
app.use('/supplier', supplierRoutes); // ✅ Supplier routes

// Default route
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    try {
        await sequelize.sync();
        console.log("✅ Database synchronized successfully.");
    } catch (error) {
        console.error("❌ Database sync error:", error);
    }
});
