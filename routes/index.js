var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var messageController = require('../controllers/messageController');
var solicitudeController = require('../controllers/solicitudeController');
var roomController = require('../controllers/roomController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/room/:room', roomController.room);

router.post('/signup', userController.create);

router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/user', userController.getUser);
router.get('/profile', userController.getProfile);

router.get('/messages', messageController.getAll);
router.post('/message', messageController.create);
router.post('/upload', messageController.upload);
router.get('/message/delete', messageController.delete);
router.get('/historial/:user/:to', messageController.getHistorialSpecificUser);

router.get('/room',roomController.getAll);
router.post('/room',roomController.create);
router.get('/room/delete',roomController.delete);

router.post('/solicitude', solicitudeController.create);
router.post('/friend/delete', userController.deleteFriend);

module.exports = router;
