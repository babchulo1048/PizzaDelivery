const express = require('express');
const router = express.Router();
const permissionController = require('../controller/permissionController');
const authMiddleware = require('../middleware/auth');

router.get('/', permissionController.getAllPermissions);
router.post('/',  permissionController.createPermission);
router.post('/assign',  permissionController.assignPermissionToRole);
router.put('/:id',  permissionController.updatePermission);
router.delete('/:id',  permissionController.delete);

module.exports = router;
