const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    Product_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Product_Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Category: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Price: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false
    },
    Stock_Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Reorder_Level: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Supplier_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Created_At: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Product',
    timestamps: false
});

module.exports = Product;
