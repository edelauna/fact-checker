var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index);

router.post('/', indexController.index_post);

//DEV
router.get('/test', indexController.index_postTest);

module.exports = router;
