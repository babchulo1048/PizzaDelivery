const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require('../middleware/auth');

// Only allow customers and admins to create orders
router.get('/', authMiddleware([1]), orderController.getAll);
router.get('/:id', authMiddleware([1]), orderController.getById);
router.post('/create', orderController.create);
router.get('/customer/:id', orderController.getByCustomerId);
router.get('/restaurant/:id',orderController.getByRestaurantId);
// router.put('/:id', authMiddleware([7]), orderController.update);
router.put('/:id', orderController.update);
router.delete('/:id', authMiddleware([8]), orderController.delete);

module.exports = router;
