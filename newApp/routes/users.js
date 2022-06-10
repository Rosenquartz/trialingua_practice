var express = require('express');
var router = express.Router();
const controller = require('../controllers/user.controller')

router.get('/', controller.getUserList);
router.post('/create', controller.createUser);
router.get('/:userId', controller.getUserProfile);
router.put('/:userId', controller.updateUser);

module.exports = router;
