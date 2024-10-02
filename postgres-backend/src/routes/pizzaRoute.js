const express = require("express");
const router = express.Router();
const pizzaController = require("../controller/pizzaController");
const authMiddleware = require('../middleware/auth');

const multer = require("multer");
const path = require("path");

const upload = multer({ dest: "uploads/" });


router.use("/uploads", express.static(path.join(__dirname, "../uploads")));


router.get('/', pizzaController.getAll)
router.get('/:id', pizzaController.getById)
router.post('/create', upload.single("image"),pizzaController.create);
router.put('/:id',pizzaController.updatePizza);
router.delete('/:id',pizzaController.delete);

module.exports = router