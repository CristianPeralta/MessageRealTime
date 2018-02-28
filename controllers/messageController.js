var User = require('../models/User');
var Message = require('../models/Message');
var mongoose = require("mongoose");
const formidable = require("formidable");
const fs = require("fs-extra");
const path = require("path");
const randomstring = require("randomstring");

module.exports.create = function (req,res) {
  let data = req.body;
  console.log(data);

  let message = new Message();
  User.findOne({_id:data.user}).then( (user, err)=>{
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (!user) {
      console.log('user not found');
    }
    message.user = mongoose.Types.ObjectId(user._id);
    message.room = mongoose.Types.ObjectId(room._id);
    message.text = data.text;
    message.save(function (err, message) {
        if(err){
          console.log(err);
          return res.sendStatus(503)
        }
        return res.json(message);
    });
  })
}

module.exports.createSocket = function (data, cb) {
  let message = new Message();
  User.findOne({_id:data.user}).then( (user, err)=>{
    if (err) {
      return cb(user, err);
    }
    if (!user) {
      return cb(user, err);
    }
    message.user = mongoose.Types.ObjectId(user._id);
    message.room = data.room;
    message.text = data.text;
    message.save(function (err, message) {
      Message.findOne({_id:message._id}).populate('user').then( (message, err) => {
          //return cb(message, err);
          io.emit('messageAdded', {data:message,ok:!err,err:err});
        });
    });
  })
}

module.exports.upload = function (req,res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
        let data = fields;
        var message= new Message();
        data.photo = path.join("uploads/", files.photo.name);

        User.findOne({_id:data.user}).then( (user, err)=>{
          if (err) {
            io.emit('messageAdded', {data:'',ok:!err,err:err});
          }
          if (!user) {
            io.emit('messageAdded', {data:'',ok:!err,err:err});
          }
          message.user = mongoose.Types.ObjectId(user._id);
          message.room = data.room;
          message.photo = data.photo;
          message.save(function (err, message) {
            Message.findOne({_id:message._id}).populate('user').then( (message, err) => {
                //return cb(message, err);
                io.emit('messageAdded', {data:message,ok:!err,err:err});
              });
          });
        })

  });
  form.on("error", function(err) {
    return res.send(null, 500);
  });

  form.on("fileBegin", function(name, file) {
    let rdName = randomstring.generate();
    rdName = rdName.replace("/", "");
    let originalName = file.name;
    file.name = rdName + path.extname(originalName);
  });

  form.on("end", function(fields, files) {
    const temp_path = this.openedFiles[0].path;
    const file_name = this.openedFiles[0].name;
    const new_location = path.join(__dirname, "../public/uploads/", file_name);

    fs.copy(temp_path, new_location, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("success!")
      }
    });
  });
}

module.exports.getAll = function (req,res) {

  Message.find({}).populate('user').then( (messages, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      return res.json(messages);
    });
}

module.exports.getAllSocket = function (room, cb) {
  console.log(room);
  Message.find({room: room}).populate('user').then( (messages, err) => {
      return cb(messages, err);
    });
}

module.exports.delete = function (req,res) {

  Message.remove({}, function(err) {
      if (!err) {
        console.log(err);
      }
      console.log(
        'deleted'
      );
      res.json('deleted')
  });
}
