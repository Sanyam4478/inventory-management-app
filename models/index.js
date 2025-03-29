const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import models
const Product = require('./product');
const Supplier = require('./supplier');

// Define associations
if (process.env.NODE_ENV !== 'test') {
    Supplier.hasMany(Product, {
      foreignKey: 'Supplier_ID',
      as: 'products'
    });
  
    Product.belongsTo(Supplier, {
      foreignKey: 'Supplier_ID',
      as: 'supplier'
    });
  }

// Export models and Sequelize connection
module.exports = {
    sequelize,
    Sequelize,
    Product,
    Supplier
};
