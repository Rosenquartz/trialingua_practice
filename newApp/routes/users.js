var express = require('express');
var router = express.Router();
const controller = require('../controllers/umbrella.controller')

router.get('/', controller.userController.getUserList);
router.post('/create', controller.userController.createUser);
router.get('/:userId', controller.userController.getUserProfile);
router.put('/update/:userId', controller.userController.updateUser);

module.exports = router;
