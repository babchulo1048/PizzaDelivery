const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.get('/', userController.getAll)
router.post('/register', userController.register);
router.post('/login',userController.login)
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);



module.exports=router;