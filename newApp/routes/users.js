var express = require('express');
var router = express.Router();
const controller = require('../controllers/user.controller')

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
  
//});

router.get('/', controller.getUsers)
router.put('/:userId', controller.putUser);

console.log('in users')
module.exports = router;
