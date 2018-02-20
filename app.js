var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require("ejs").__express;

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log('Un cliente se ha conectado');
});

var index = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/messageDb', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

io.on('connection', function(socket) {

	console.log('A client has connected');

	socket.on('SignUp', function(data){
		console.log('sending registration');
		console.log(data);
	});

  socket.on('disconnect', function(){
		console.log(' has disconnected');
	});
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server.listen(5000, function() {
	console.log('Servidor corriendo en http://localhost:3000');
});

module.exports = app;
