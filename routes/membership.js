const router = require('express').Router();
const membershipController = require('../controllers/membershipController');

router.get('/join', membershipController.getJoinMembership);

router.post('/join', membershipController.postJoinMembership);

module.exports = router;
