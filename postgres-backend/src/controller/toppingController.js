const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const { z } = require('zod');

// Zod schema for validating topping input
const toppingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be a positive number'), // Updated to include price
});

// Get all toppings
exports.getAllToppings = asyncMiddleware(async (req, res) => {
    const result = await pool.query('SELECT * FROM toppings');
    res.json(result.rows);
});

// Create a new topping
exports.createTopping = asyncMiddleware(async (req, res) => {
    const validation = toppingSchema.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, price } = validation.data; // Removed pizza_id

    const result = await pool.query(
        'INSERT INTO toppings (name, price) VALUES ($1, $2) RETURNING *', // Updated to remove pizza_id
        [name, price]
    );
    res.status(201).json(result.rows[0]);
});

// Update a topping
exports.updateTopping = asyncMiddleware(async (req, res) => {
    const { id } = req.params; 
    const validation = toppingSchema.safeParse(req.body); 
    
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors }); 
    }

    const { name, price } = validation.data; // Removed pizza_id

    const result = await pool.query(
        'UPDATE toppings SET name = $1, price = $2 WHERE id = $3 RETURNING *', // Updated to remove pizza_id
        [name, price, id] 
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Topping not found' }); 
    }

    res.status(200).json(result.rows[0]); 
});

// Delete a topping
exports.deleteTopping = asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM toppings WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Topping not found' });
    }
    res.json({ message: 'Topping deleted successfully' });
});
