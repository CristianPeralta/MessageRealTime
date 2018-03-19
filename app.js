var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require("ejs").__express;

var app = express();
var server = require('http').Server(app);
global.io = require('socket.io')(server);
var messageController = require('./controllers/messageController');
var solicitudeController = require('./controllers/solicitudeController');
var userController = require('./controllers/userController');

var usersOnline = [];

var index = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/messageDb', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});
io.on('connection', function(socket) {
	console.log('A client has connected');
  console.log(socket.id);
	socket.on('userConnected', (data) => {
      data.id = socket.id;
      console.log(data);
      addUserinRoom(data, () => {
        console.log(usersOnline);
        io.emit('usersConnected', {data:usersOnline});
      })
	});


	socket.on('SignUp', function(data){
		console.log('sending registration');
		console.log(data);
	});

  socket.on('addSolicitude', (data) => {
		solicitudeController.createSocket(data, (solicitude, err) => {
      console.log('adding');
      console.log(data.friend.id);
      io.to(data.friend.id).emit('solicitudeAdded', {data:solicitude, ok:!err,err:err});
      io.to(socket.id).emit('solicitudeAdded', {data:solicitude, ok:!err,err:err});
		})
	});

  socket.on('deleteSolicitude', (data) => {
    solicitudeController.deleteSocket(data, (err) => {
      io.to(socket.id).emit('solicitudeDeleted', {data:data, ok:!err,err:err});
    })
  });

  socket.on('acceptSolicitude', (data) => {
    solicitudeController.acceptSocket(data, (user, friend, err) => {
      console.log('¿friend');
      console.log(friend);
      io.to(socket.id).emit('solicitudeAccepted', {data:user, ok:!err,err:err});
      isOnline(friend._id, (el) => {
        if (el) {
          console.log('goo job');
          console.log(el);
          io.to(el.id).emit('solicitudeAccepted', {data:friend, ok:!err,err:err});
        }
      })
    })
  });

  socket.on('getUserSocket', (id) => {
    console.log('getting socket');
    console.log(id);
    isOnline(id, (el) => {
      io.to(socket.id).emit('userFound', {data:el});
    })
  });

  socket.on('getFriends', (data) => {
    console.log(data);
    userController.getFriendsSocket(data, (friends, err) => {
      friendsOnline(friends, (friendsOn) => {
        if (friendsOn.length>0) {
          socket.emit('friendsGetted', {data:friendsOn, ok:!err, err:err});
        }
      })
		})
  });

	socket.on('addMessage', (data) => {
		messageController.createSocket(data, (message, err) => {
      console.log('new message');
			io.emit('messageAdded', {data:message,ok:!err,err:err});
		})
	});

  socket.on('addMessagePrivated', (data) => {
    console.log('message privated');
    messageController.createSocket(data, (message, err) => {
      console.log('message created');
      console.log(message);
      io.to(data.to.id).emit('addMessagePrivated', {data:message, ok:!err,err:err});
      io.to(socket.id).emit('addMessagePrivated', {data:message, ok:!err,err:err});
		})
	});

	socket.on('getMessages', (room) => {
		messageController.getAllSocket(room, (messages, err) => {
			socket.emit('messagesGetted', {data:messages,ok:!err,err:err});
		})
	});

  socket.on('userDisconnect', function(data) {
      usersOnline.map((element, idx) => {
        if (element.user._id == data.user._id) {
          usersOnline.splice(idx,1);
        }
      });
      socket.disconnect();
      console.log(io.eio.clients);
      usersOnline = usersOnline.filter(function(n){ return n != undefined })
      io.emit('usersConnected', {data:usersOnline});
   });

	socket.on('disconnect', function() {
      console.log('Got disconnect!');
   });
});
//
// function getUsersOfRoom(data, cb) {
//   let usersRoom = usersOnline.map((element) => {
//     if (element.room == data.room) {
//       return element
//     }
//   })
//   usersRoom = usersRoom.filter(function(n){ return n != undefined })
//   console.log(usersRoom);
//   cb(usersRoom);
// }

function addUserinRoom(data, cb) {
  if (data.user!=null) {
    let exist=false;
    if (usersOnline.length!=0) {
      exist = usersOnline.find((element) =>{
        return (element.user._id == data.user._id) && (element.room == data.room);
      });
    }
    if (!exist) {
      usersOnline.push(data);
    }
    usersOnline = usersOnline.filter(function(n){ return n != undefined })
    cb();
  }
}

function isOnline(data, cb) {
  if (data!=null) {
    let exist=false;
    if (usersOnline.length!=0) {
      exist = usersOnline.find((element) =>{
        return (element.user._id == data);
      });
    }
    friendsOn = friendsOn.filter(function(n){ return n != undefined })
    cb(exist);
  }
}


function friendsOnline(friends, cb) {
    let friendsOn = [];
    console.log('function friends');
    let ids = friends.map((friend) => {
      return friend._id;
    })
    console.log(ids);
    if (usersOnline.length!=0) {
      friends.map((friend) => {
        isOnline(friend._id, (el) => {
          friendsOn.push(el);
        });
      })
      console.log('getting friends');
      cb(friendsOn);
    }
}


function getUserById(id, cb) {
  if (id!=null) {
    if (usersOnline.length!=0) {
      let idx = usersOnline.map( (val, key) => {
        if (val.user._id == id) {
          return key;
        }
      })
      cb(idx);
    }
  }
}
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

module.exports = {
	io:'hola'
};
