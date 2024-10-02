const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
    user: process.env.DB_USER || 'postgres', // Use env variables for flexibility
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'Pizza_Delivery',
    password: process.env.DB_PASSWORD || 'eyoel1234',
    port: process.env.DB_PORT || 5432,
});

module.exports = pool;
