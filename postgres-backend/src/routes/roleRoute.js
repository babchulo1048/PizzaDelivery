const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const authMiddleware = require('../middleware/auth');

// Role management routes
router.get('/', roleController.getAllRoles); // Permission to view roles
router.post('/', roleController.createRole); // Permission to create roles
router.put('/:id', roleController.editRole); // Permission to update roles
router.delete('/:id', roleController.removeRole); // Permission to delete roles

module.exports = router;
