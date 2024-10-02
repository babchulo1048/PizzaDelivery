const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const { z } = require('zod');

// Update the roleSchema to validate permissions as an array of integers
const roleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    permissions: z.array(z.number().int()).optional(), // Change to integer
});

exports.getAllRoles = asyncMiddleware(async (req, res) => {
    const result = await pool.query('SELECT * FROM roles');
    res.json(result.rows);
});

exports.createRole = asyncMiddleware(async (req, res) => {
    const validation = roleSchema.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, permissions } = validation.data;

    const result = await pool.query(
        'INSERT INTO roles (name, description, permissions) VALUES ($1, $2, $3) RETURNING *',
        [name, description, permissions]
    );

    res.status(201).json(result.rows[0]);
});

exports.editRole = asyncMiddleware(async (req, res) => {
    const roleId = req.params.id;
    const validation = roleSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description, permissions } = validation.data;

    // Update the role without checking for name uniqueness
    const result = await pool.query(
        'UPDATE roles SET name = $1, description = $2, permissions = $3 WHERE id = $4 RETURNING *',
        [name, description, permissions, roleId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Role not found' });
    }

    res.json(result.rows[0]);
});


exports.removeRole = asyncMiddleware(async (req, res) => {
    const roleId = req.params.id;
    const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING *', [roleId]);
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
});
