var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var messageController = require('../controllers/messageController');
var roomController = require('../controllers/roomController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/signup', userController.create);

router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/user', userController.getUser);

router.get('/messages', messageController.getAll);
router.post('/message', messageController.create);
router.get('/message/delete', messageController.delete);

router.get('/room',roomController.getAll);
router.post('/room',roomController.create);

module.exports = router;
