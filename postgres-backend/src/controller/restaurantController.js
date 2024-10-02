const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const { z } = require('zod');

const restaurantSchema = z.object({
    name: z.string().min(1, "Restaurant name is required"),
    address: z.string().min(1, "Address is required"),
    super_admin_id: z.number().int().positive("super_admin_id must be a positive integer")
  });

exports.getAll = asyncMiddleware(async (req, res) => {
   
    const restaurants = await pool.query('SELECT * FROM restaurants');
    res.json(restaurants.rows);

});

exports.create = asyncMiddleware(async (req, res) => {
    const validation = restaurantSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, address, super_admin_id } = validation.data;
    const result = await pool.query(
        'INSERT INTO restaurants (name, address, super_admin_id) VALUES ($1, $2, $3) RETURNING *',
        [name, address, super_admin_id]
    );
    res.status(201).json(result.rows[0]);
})