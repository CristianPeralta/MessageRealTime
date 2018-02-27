var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require("ejs").__express;

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var messageController = require('./controllers/messageController');

var usersOnline = [];

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

	socket.on('userConnected', (data) => {
			console.log(data);
			let exist = usersOnline.find((user) =>{
				return user._id == data._id;
			});
			if (!exist) {
				usersOnline.push(data);
			}
			io.emit('usersConnected', {data:usersOnline});
	});


	socket.on('SignUp', function(data){
		console.log('sending registration');
		console.log(data);
	});

	socket.on('addMessage', (data) => {
		messageController.createSocket(data, (message, err) => {
			io.emit('messageAdded', {data:message,ok:!err,err:err});
		})
	});

	socket.on('getMessages', (room) => {
		messageController.getAllSocket(room, (messages, err) => {
			io.emit('messagesGetted', {data:messages,ok:!err,err:err});
		})
	});
	socket.on('disconnect', function() {
      console.log('Got disconnect!');
   });
});


app.use(session({
    // When there is nothing on the session, do not save it
    saveUninitialized: false,
    // Update session if it changes
    resave: true,
    // Set cookie
    cookie: {
        secure: false,
        maxAge: 365 * 24 * 60 * 60 * 1000
    },
    // Name of your cookie
    name: 'testCookie',
    // Secret of your cookie
    secret: 'thisIsSecret'
}));

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
