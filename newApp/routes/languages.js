var express = require('express');
var router = express.Router();
const controller = require('../controllers/umbrella.controller')

router.get('/', controller.languageController.getLanguageList);
router.get('/:languageId', controller.languageController.getModuleList);
router.get('/:languageId/:moduleId', controller.languageController.getItemList);

module.exports = router;
