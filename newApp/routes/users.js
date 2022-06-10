var express = require('express');
var router = express.Router();
const controller = require('../controllers/user.controller')

router.get('/', controller.getUserList);
router.post('/newUser', controller.createUser);
router.put('/:userId', controller.getUserProfile);

module.exports = router;
