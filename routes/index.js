var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/signup',userController.create);

router.post('/login',userController.login);
router.post('/logout',userController.logout);

router.get('/user',userController.getUser);

router.get('/messages',messageController.getAll);

router.post('/message',messageController.create);

module.exports = router;
