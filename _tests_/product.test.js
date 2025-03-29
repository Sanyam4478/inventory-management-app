const request = require('supertest');
const express = require('express');
const router = require('../routes/product');
const { Product, Supplier } = require('../models');

// 🧪 Set up mock app
const app = express();
app.set('views', './views');         // Prevent EJS engine errors
app.set('view engine', 'ejs');       // Add mock engine setup
app.use(express.urlencoded({ extended: false }));
app.use('/inventory', router);

// 🧪 Mock Sequelize models
jest.mock('../models', () => ({
  Product: {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Supplier: {
    findAll: jest.fn()
  }
}));

describe('Product Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ GET /
  it('GET /inventory should render inventory with products and suppliers', async () => {
    Product.findAll.mockResolvedValue([{ Product_ID: 1, Product_Name: 'Apples' }]);
    Supplier.findAll
      .mockResolvedValueOnce([{ Supplier_ID: 1, Name: 'Supplier A', Status: 'active' }]) // active suppliers
      .mockResolvedValueOnce([{ Supplier_ID: 1, Name: 'Supplier A' }]); // all suppliers

    const res = await request(app).get('/inventory');
    expect(res.statusCode).toBe(200); // If you want to test .render, you'll need a view engine mock
  });

  // ✅ POST /add
  it('POST /inventory/add should create a new product', async () => {
    Product.create.mockResolvedValue({});

    const res = await request(app)
      .post('/inventory/add')
      .send({
        Product_Name: 'Milk',
        Category: 'Dairy',
        Price: 2.99,
        Stock_Quantity: 20,
        Reorder_Level: 5,
        Supplier_ID: 1
      });

    expect(Product.create).toHaveBeenCalled();
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/inventory');
  });

  // ✅ POST /edit/:id
  it('POST /inventory/edit/:id should update a product', async () => {
    Product.update.mockResolvedValue([1]);

    const res = await request(app)
      .post('/inventory/edit/1')
      .send({
        Product_Name: 'Bread',
        Category: 'Bakery',
        Price: 1.99,
        Stock_Quantity: 10,
        Reorder_Level: 3,
        Supplier_ID: 2
      });

    expect(Product.update).toHaveBeenCalledWith(expect.any(Object), { where: { Product_ID: '1' } });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/inventory');
  });

  // ✅ POST /delete/:id
  it('POST /inventory/delete/:id should delete a product', async () => {
    Product.destroy.mockResolvedValue(1);

    const res = await request(app).post('/inventory/delete/1');

    expect(Product.destroy).toHaveBeenCalledWith({ where: { Product_ID: '1' } });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/inventory');
  });

  // ❌ Error handling (simulate failure)
  it('GET /inventory should return 500 on DB failure', async () => {
    Product.findAll.mockRejectedValue(new Error('DB Error'));
    Supplier.findAll.mockResolvedValue([]);

    const res = await request(app).get('/inventory');
    expect(res.statusCode).toBe(500);
  });
});