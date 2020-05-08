const router = require('express').Router();
const adminController = require('../controllers/adminController');

router.post('/join', adminController.postAdminJoin);

module.exports = router;
