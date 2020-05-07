const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/list', (req, res) => {
  res.send('GET /user/list not implemented');
});

router.get('/create', userController.getUserCreate);

router.post('/create', userController.postUserCreate);

router.get('/log-in', userController.getUserLogin);

router.post('/log-in', userController.postUserLogin);

router.get('/log-out', userController.getLogout);

module.exports = router;
