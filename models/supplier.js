const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
    Supplier_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Supplier_Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Contact_Number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
    Created_At: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Supplier',
    timestamps: false
});

module.exports = Supplier;
