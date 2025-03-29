const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Create a new Sequelize instance with PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Disable logging (optional)
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for some cloud-hosted PostgreSQL services (e.g., Neon.tech)
        }
    }
});

// Function to test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        if (process.env.NODE_ENV !== 'test') {
            console.log('✅ Database connection established successfully.');
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'test') {
            console.error('❌ Unable to connect to the database:', error);
        }
    }
};

if (process.env.NODE_ENV !== 'test') {
    testConnection();
}

module.exports = sequelize;
