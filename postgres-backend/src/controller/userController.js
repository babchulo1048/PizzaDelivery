const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, expiresIn } = require('../../config/index');
const { z } = require('zod');

// Update the validation schema to require role_id
const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role_id: z.number().int().positive("Role ID is required") // Changed from role to role_id
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});

// Get all users
exports.getAll = asyncMiddleware(async (req, res) => {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
});

// Register a new user
exports.register = asyncMiddleware(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, email, password, role_id } = parsed.data;

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role_id]
    );

    

    // Fetch the role object based on role_id
    const roleResult = await pool.query('SELECT * FROM roles WHERE id = $1', [role_id]);
    const role = roleResult.rows[0]; // Assuming role exists

    // Sign the token with role information
    const token = jwt.sign({ userId: result.rows[0].id, roleId: role.id, role: { id: role.id, name: role.name, permissions: role.permissions  } }, JWT_SECRET, {
        expiresIn,
    });

    res.status(201).json({ user: { ...result.rows[0], role }, token }); // Include the role object in the response
});


// User login
exports.login = asyncMiddleware(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
    }

    const { email, password } = parsed.data;

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log("user:",user.rows[0])
    if (user.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const storedPasswordHash = user.rows[0].password;
    console.log("Stored Password Hash:", storedPasswordHash); // Log the hashed password
    
    const validPassword = await bcrypt.compare(password, storedPasswordHash);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userRoleId = user.rows[0].role_id;
if (userRoleId === null) {
    return res.status(403).json({ error: 'User has no assigned role' });
}

    // Fetch the role object based on role_id
    const roleResult = await pool.query('SELECT * FROM roles WHERE id = $1', [user.rows[0].role_id]);
    const role = roleResult.rows[0]; // Assuming role exists
    console.log("user:",user.rows[0])
    console.log("role:",roleResult.rows[0])

    // Sign the token with role information
    const token = jwt.sign({ userId: user.rows[0].id, roleId: role.id, role: { id: role.id, name: role.name, permissions: role.permissions } }, JWT_SECRET, {
        expiresIn,
    });

    res.json({ user: { ...user.rows[0], role }, token }); // Include the role object in the response
});



exports.update = asyncMiddleware(async (req, res) => {
    const userId = req.params.id;
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, email, password, role_id } = parsed.data;

    // Fetch the existing user data
    const existingUserResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (existingUserResult.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    const existingUser = existingUserResult.rows[0];

    // Hash the password only if it's provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    const result = await pool.query(
        'UPDATE users SET name = $1, email = $2, password = $3, role_id = $4 WHERE id = $5 RETURNING *',
        [name, email, hashedPassword, role_id, userId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
});


exports.delete = asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
});
