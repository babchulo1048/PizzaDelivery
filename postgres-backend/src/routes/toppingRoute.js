const express = require('express');
const router = express.Router();
const toppingController = require('../controller/toppingController');
const authMiddleware = require('../middleware/auth');  // If you have authentication

// Routes for managing toppings
router.get('/', toppingController.getAllToppings); // Get all toppings
router.post('/', toppingController.createTopping); // Create a new topping
router.put('/:id', toppingController.updateTopping); // Update a topping by ID
router.delete('/:id', toppingController.deleteTopping); // Delete a topping by ID

module.exports = router;
