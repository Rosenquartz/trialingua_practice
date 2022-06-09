var express = require('express');
var router = express.Router();
const controller = require('../controllers/language.controller')

router.get('/', controller.getLanguageList);

module.exports = router;
