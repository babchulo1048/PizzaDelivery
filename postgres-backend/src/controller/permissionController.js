const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const { z } = require('zod');


const permissionSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(), 
});

const assignPermissionSchema = z.object({
    roleId: z.number().int().positive('Role ID must be a positive integer'),
    permissionId: z.number().int().positive('Permission ID must be a positive integer'),
});


exports.getAllPermissions = asyncMiddleware(async (req, res) => {
    const result = await pool.query('SELECT * FROM permissions');
    res.json(result.rows);
});


exports.createPermission = asyncMiddleware(async (req, res) => {
    const validation = permissionSchema.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { name, description } = validation.data;

    const result = await pool.query(
        'INSERT INTO permissions (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
    );
    res.status(201).json(result.rows[0]);
});

exports.updatePermission = asyncMiddleware(async (req, res) => {
    const { id } = req.params; 
    const validation = permissionSchema.safeParse(req.body); 
    
    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors }); 
    }

    const { name, description } = validation.data; 

    const result = await pool.query(
        'UPDATE permissions SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, id] 
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Permission not found' }); 
    }

    res.status(200).json(result.rows[0]); 
});

exports.delete = asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM permissions WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Permission not found' });
    }
    res.json({ message: 'Permission deleted successfully' });
});


exports.assignPermissionToRole = asyncMiddleware(async (req, res) => {
    const validation = assignPermissionSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.errors });
    }

    const { roleId, permissionId } = validation.data;

    const result = await pool.query(
        'INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) RETURNING *',
        [roleId, permissionId]
    );
    res.status(201).json(result.rows[0]);
});
