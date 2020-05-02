const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/list', (req, res) => {
  res.send('GET /user/list not implemented');
});

router.get('/create', userController.getUserCreate);

router.post('/create', userController.postUserCreate);

router.get('/log-in', (req, res) => {
  res.send('GET /user/log-in not implemented');
});

router.post('log-in', (req, res) => {
  res.send('POST /user/log-in not implemented');
});

router.get('log-out', (req, res) => {
  res.send('GET /user/log-out not implemented');
});

module.exports = router;
