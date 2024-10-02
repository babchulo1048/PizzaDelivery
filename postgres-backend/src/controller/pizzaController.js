const pool = require('../../config/db');
const asyncMiddleware = require('../middleware/async');
const { z } = require('zod');
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

// Zod schema for pizza validation
const pizzaSchema = z.object({
  name: z.string().min(1, "Pizza name is required"),
  price: z.number().positive("Price must be a positive number"),
  restaurant_id: z.number().int().positive("restaurant_id must be a positive integer"),
  toppings: z.array(z.string().min(1, 'Topping name is required')).optional(),
});

exports.getAll = asyncMiddleware(async (req, res) => {
  const pizzas = await pool.query('SELECT * FROM pizzas');
  res.json(pizzas.rows.map(pizza => ({
      id: pizza.id,
      name: pizza.name,
      price: pizza.price,
      restaurant_id: pizza.restaurant_id,
      image: pizza.image,
      toppings: pizza.toppings // Make sure toppings are included
  })));
});


exports.create = asyncMiddleware(async (req, res) => {
  const cleanedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key.trim(), value])
  );

  // Validate the input
  const validation = pizzaSchema.safeParse({
      ...cleanedBody,
      price: Number(cleanedBody.price),
      restaurant_id: Number(cleanedBody.restaurant_id),
      toppings: Array.isArray(cleanedBody.toppings) ? cleanedBody.toppings : [],
  });

  if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
  }

  const { name, price, restaurant_id, toppings } = validation.data;

  let image;

  if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      image = newPath;
  }

  // Upload image to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "PizzaImages",
  });

  // Prepare the image object for PostgreSQL
  const imageJSON = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
  };

  // Insert pizza into the database, including toppings as an array
  const pizzaResult = await pool.query(
      'INSERT INTO pizzas (name, price, restaurant_id, image, toppings) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, restaurant_id, imageJSON, toppings] // Include toppings
  );

  const createdPizza = pizzaResult.rows[0]; // Get the created pizza with toppings

  res.status(201).json(createdPizza);
});



exports.getById = asyncMiddleware(async (req, res) => {
  const pizzaId = req.params.id;
  const pizzaResult = await pool.query('SELECT * FROM pizzas WHERE id = $1', [pizzaId]);

  if (pizzaResult.rows.length === 0) {
    return res.status(404).json({ message: 'Pizza not found' });
  }

  // Fetch associated toppings
  const toppingsResult = await pool.query('SELECT name FROM toppings WHERE pizza_id = $1', [pizzaId]);

  const pizza = {
    ...pizzaResult.rows[0],
    toppings: toppingsResult.rows.map(row => row.name),
  };

  res.json(pizza);
});

exports.updatePizza = asyncMiddleware(async (req, res) => {
  const pizzaId = req.params.id;

  const validation = pizzaSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { name, price, restaurant_id, toppings = [] } = validation.data;
  let image = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const uploadResult = await cloudinary.uploader.upload(newPath, {
      folder: "PizzaImages",
    });

    image = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  let query = `UPDATE pizzas SET name = $1, price = $2, restaurant_id = $3`;
  const queryParams = [name, price, restaurant_id];

  if (image) {
    query += `, image = $4`;
    queryParams.push(image);
  }

  query += ` WHERE id = $${queryParams.length + 1} RETURNING *`;
  queryParams.push(pizzaId);

  const pizzaResult = await pool.query(query, queryParams);

  if (pizzaResult.rows.length === 0) {
    return res.status(404).json({ message: 'Pizza not found' });
  }

  // Update toppings: First, delete old toppings, then add new ones
  await pool.query('DELETE FROM toppings WHERE pizza_id = $1', [pizzaId]);

  if (toppings.length > 0) {
    const toppingQueries = toppings.map(topping => {
      return pool.query('INSERT INTO toppings (name, pizza_id) VALUES ($1, $2)', [topping, pizzaId]);
    });
    await Promise.all(toppingQueries);
  }

  res.status(200).json(pizzaResult.rows[0]);
});

exports.delete = asyncMiddleware(async (req, res) => {
  const pizzaId = req.params.id;

  // Delete associated toppings
  await pool.query('DELETE FROM toppings WHERE pizza_id = $1', [pizzaId]);

  const result = await pool.query('DELETE FROM pizzas WHERE id = $1 RETURNING *', [pizzaId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Pizza not found' });
  }

  res.json({ message: 'Pizza deleted successfully' });
});
