const express = require("express");
const userRoute = require("./userRoute");
const restaurantRoute = require("./restaurantRoute");
const pizzaRoute = require("./pizzaRoute");
const orderRoute = require("./orderRoute");
const permissionRoute = require("./permissionRoute")
const roleRoute = require("./roleRoute")
const toppingRoute = require("./toppingRoute")
const router = express.Router();
const error = require("../middleware/error"); // Error handling middleware


router.use("/users", userRoute);
router.use("/restaurants", restaurantRoute);
router.use("/pizzas", pizzaRoute);
router.use("/orders", orderRoute);
router.use("/permission", permissionRoute);
router.use("/roles",roleRoute)
router.use("/toppings", toppingRoute);

// Use the error middleware for error handling
router.use(error);

module.exports = router;
