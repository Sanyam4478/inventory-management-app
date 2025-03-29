const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database'); // Database connection

const User = sequelize.define('User', {
    User_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    Password_Hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Role: {
        type: DataTypes.ENUM('Admin', 'Manager', 'Staff'),
        allowNull: false,
        defaultValue: 'Staff'
    },
    Created_At: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'User',
    timestamps: false,
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.Password_Hash = await bcrypt.hash(user.Password_Hash, salt);
        }
    }
});

module.exports = User;
