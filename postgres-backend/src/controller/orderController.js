const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const { z } = require('zod');

const orderSchema = z.object({
    customer_id: z.number().int().positive(),
    pizza_id: z.number().int().positive(),
    restaurant_id: z.number().int().positive(),
    quantity: z.number().int().min(1),
    toppings: z.array(z.number().int().positive()).optional(), // Adding toppings as an optional field
});

// Get all orders
exports.getAll = asyncMiddleware(async (req, res) => {
    const orders = await pool.query('SELECT * FROM orders');
    res.json(orders.rows);
});

// Get order by ID
exports.getById = asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const orderQuery = `
      SELECT 
        o.id AS order_id,
        o.status,
        o.total_price,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) AS customer,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'price', p.price
        ) AS pizza,
        json_build_object(
          'id', r.id,
          'name', r.name,
          'address', r.address
        ) AS restaurant,
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name
            )
          )
          FROM toppings t
          JOIN order_toppings ot ON ot.topping_id = t.id
          WHERE ot.order_id = o.id
        ) AS toppings
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pizzas p ON o.pizza_id = p.id
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = $1;
    `;

    const order = await pool.query(orderQuery, [id]);

    if (order.rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order.rows[0]);
});

// Get orders by customer ID
exports.getByCustomerId = asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const orderQuery = `
      SELECT 
        o.id AS order_id,
        o.status,
        o.total_price,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) AS customer,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'price', p.price
        ) AS pizza,
        json_build_object(
          'id', r.id,
          'name', r.name,
          'address', r.address
        ) AS restaurant,
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name
            )
          )
          FROM toppings t
          JOIN order_toppings ot ON ot.topping_id = t.id
          WHERE ot.order_id = o.id
        ) AS toppings
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pizzas p ON o.pizza_id = p.id
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.customer_id = $1;
    `;

    const orders = await pool.query(orderQuery, [id]);

    if (orders.rows.length === 0) {
        return res.status(404).json({ message: 'No orders found for this customer' });
    }

    res.json(orders.rows);
});

// Get orders by restaurant ID
exports.getByRestaurantId = asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const orderQuery = `
      SELECT 
        o.id AS order_id,
        o.status,
        o.total_price,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) AS customer,
        json_build_object(
          'id', p.id,
          'name', p.name,
          'price', p.price
        ) AS pizza,
        json_build_object(
          'id', r.id,
          'name', r.name,
          'address', r.address
        ) AS restaurant,
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'name', t.name
            )
          )
          FROM toppings t
          JOIN order_toppings ot ON ot.topping_id = t.id
          WHERE ot.order_id = o.id
        ) AS toppings
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pizzas p ON o.pizza_id = p.id
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.restaurant_id = $1;
    `;

    const order = await pool.query(orderQuery, [id]);

    if (order.rows.length === 0) {
        return res.status(404).json({ message: 'No orders found for this restaurant' });
    }

    res.json(order.rows);
});

// Create an order
exports.create = asyncMiddleware(async (req, res) => {
  const validatedData = orderSchema.parse(req.body);
  const { customer_id, pizza_id, restaurant_id, quantity, toppings } = validatedData;

  // Fetch pizza price
  const pizzaQuery = await pool.query('SELECT price FROM pizzas WHERE id = $1', [pizza_id]);
  const pizzaPrice = pizzaQuery.rows[0]?.price;

  if (!pizzaPrice) {
      return res.status(404).json({ message: 'Pizza not found' });
  }

  // Calculate toppings total price if toppings are provided
  let toppingsTotalPrice = 0;
  if (toppings && toppings.length > 0) {
      const toppingsPriceQuery = await pool.query(
          'SELECT price FROM toppings WHERE id = ANY($1::int[])',
          [toppings]
      );
      console.log("toppingsPriceQuery.rows:",toppingsPriceQuery.rows)
      toppingsTotalPrice = toppingsPriceQuery.rows.reduce((total, topping) => total + parseFloat(topping.price), 0);
  }

  // Calculate total price
  const total_price = parseFloat((pizzaPrice * quantity) + toppingsTotalPrice).toFixed(2);
  console.log('Total Price:', total_price)

  // Insert the order into the database
  const result = await pool.query(
      'INSERT INTO orders (customer_id, pizza_id, restaurant_id, quantity, total_price, toppings) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [customer_id, pizza_id, restaurant_id, quantity, total_price, toppings]
  );

  res.status(201).json(result.rows[0]);
});


// Update an order
exports.update = asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
        message: 'Order updated successfully',
        order: result.rows[0]
    });
});

// Delete an order
exports.delete = asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
});
