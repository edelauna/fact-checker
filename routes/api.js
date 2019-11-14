var express = require('express');
var router = express.Router();

const apiController = require('../controllers/apiController'); 

/* GET users listing. */
router.get('/search', apiController.apiQueryController);

module.exports = router;
