const request = require('supertest');
const express = require('express');
const Supplier = require('../models/supplier');
const router = require('../routes/supplier');

const app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/supplier', router);

describe('Supplier Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ✅ GET /
    it('GET /supplier should render filtered supplier list', async () => {
        jest.spyOn(Supplier, 'findAll').mockResolvedValue([{ Supplier_ID: 1, Supplier_Name: 'ABC' }]);
        const res = await request(app).get('/supplier');
        expect(Supplier.findAll).toHaveBeenCalledWith({ where: { Status: 'active' } });
        expect(res.statusCode).toBe(200);
    });

    it('GET /supplier should return 500 on DB error', async () => {
        jest.spyOn(Supplier, 'findAll').mockRejectedValue(new Error('DB Error'));
        const res = await request(app).get('/supplier');
        expect(res.statusCode).toBe(500);
    });

    // ✅ GET /filter/:status
    it('GET /supplier/filter/:status should return suppliers in JSON', async () => {
        jest.spyOn(Supplier, 'findAll').mockResolvedValue([{ Supplier_ID: 2, Status: 'inactive' }]);
        const res = await request(app).get('/supplier/filter/inactive');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ Supplier_ID: 2, Status: 'inactive' }]);
    });

    it('GET /supplier/filter/:status should return 500 on DB error', async () => {
        jest.spyOn(Supplier, 'findAll').mockRejectedValue(new Error('DB Error'));
        const res = await request(app).get('/supplier/filter/inactive');
        expect(res.statusCode).toBe(500);
    });

    // ✅ POST /add
    it('POST /supplier/add should create a new supplier and redirect', async () => {
        jest.spyOn(Supplier, 'create').mockResolvedValue({});
        const res = await request(app).post('/supplier/add').send({
            Supplier_Name: 'XYZ',
            Contact_Number: '1234567890',
            Email: 'xyz@example.com',
            Address: 'India',
        });
        expect(Supplier.create).toHaveBeenCalledWith(expect.objectContaining({ Status: 'active' }));
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/supplier');
    });

    it('POST /supplier/add should return 500 on DB error', async () => {
        jest.spyOn(Supplier, 'create').mockRejectedValue(new Error('DB Error'));
        const res = await request(app).post('/supplier/add').send({});
        expect(res.statusCode).toBe(500);
    });

    // ✅ POST /edit/:id
    it('POST /supplier/edit/:id should update supplier and redirect', async () => {
        jest.spyOn(Supplier, 'update').mockResolvedValue([1]);
        const res = await request(app).post('/supplier/edit/1').send({
            Supplier_Name: 'DEF',
            Contact_Number: '9876543210',
            Email: 'def@example.com',
            Address: 'Canada',
        });
        expect(Supplier.update).toHaveBeenCalled();
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/supplier');
    });

    it('POST /supplier/edit/:id should return 500 on DB error', async () => {
        jest.spyOn(Supplier, 'update').mockRejectedValue(new Error('DB Error'));
        const res = await request(app).post('/supplier/edit/1').send({});
        expect(res.statusCode).toBe(500);
    });

    // ✅ POST /delete/:id
    it('POST /supplier/delete/:id should soft-delete supplier', async () => {
        jest.spyOn(Supplier, 'update').mockResolvedValue([1]);
        const res = await request(app).post('/supplier/delete/2');
        expect(Supplier.update).toHaveBeenCalledWith(
            { Status: 'inactive' },
            { where: { Supplier_ID: '2' } }
        );
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/supplier');
    });

    it('POST /supplier/delete/:id should return 500 on DB error', async () => {
        jest.spyOn(Supplier, 'update').mockRejectedValue(new Error('DB Error'));
        const res = await request(app).post('/supplier/delete/2');
        expect(res.statusCode).toBe(500);
    });

    // ✅ POST /restore/:id
    it('POST /supplier/restore/:id should restore supplier with JSON response', async () => {
        jest.spyOn(Supplier, 'update').mockResolvedValue([1]);
        const res = await request(app).post('/supplier/restore/3');
        expect(Supplier.update).toHaveBeenCalledWith(
            { Status: 'active' },
            { where: { Supplier_ID: '3' } }
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('POST /supplier/restore/:id should return 500 on DB error', async () => {
        jest.spyOn(Supplier, 'update').mockRejectedValue(new Error('DB Error'));
        const res = await request(app).post('/supplier/restore/3');
        expect(res.statusCode).toBe(500);
    });
});
