const router = require('express').Router();
const messageController = require('../controllers/messageController');

router.get('/create', messageController.getMessageForm);

router.post('/create', messageController.postMessageForm);

router.post('/remove/:id', messageController.postRemoveMessage);

module.exports = router;
