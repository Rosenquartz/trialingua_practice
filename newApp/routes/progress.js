var express = require('express');
var router = express.Router();
const controller = require('../controllers/umbrella.controller')

router.get('/:language', controller.progressController.languageProgress);
router.get('/:language/:module', controller.progressController.moduleProgress);
router.get('/:language/:module/:item', controller.progressController.itemProgress);

router.put('/update/:language/:module/:item', controller.progressController.update);
router.get('/:language/:module/', controller.progressController.getItems);

module.exports = router;
