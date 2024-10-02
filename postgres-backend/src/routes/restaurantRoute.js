const express = require("express");
const router = express.Router();
const restaurantController = require("../controller/restaurantController");
const authMiddleware = require('../middleware/auth');


router.get('/', restaurantController.getAll)
router.post('/create', restaurantController.create);

module.exports = router