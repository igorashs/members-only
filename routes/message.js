const router = require('express').Router();
const messageController = require('../controllers/messageController');

router.get('/create', messageController.getMessageForm);

router.post('/create', (req, res) => {
  res.send('POST /message/create not implemented');
});

module.exports = router;
