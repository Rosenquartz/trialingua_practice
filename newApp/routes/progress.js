var express = require('express');
var router = express.Router();
const controller = require('../controllers/progress.controller')

router.get('/', controller.getProgress);

module.exports = router;