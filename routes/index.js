const router = require('express').Router();
const indexController = require('../controllers/indexController');

// GET all messages on the home page
router.get('/', indexController.getIndex);

module.exports = router;
