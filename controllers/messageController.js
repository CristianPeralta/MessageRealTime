var User = require('../models/User');
var Message = require('../models/Message');
var mongoose = require("mongoose");


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
    message.text = data.text;
    message.save(function (err, message) {
      Message.findOne({_id:message._id}).populate('user').then( (message, err) => {
          return cb(message, err);
        });
    });
  })
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

module.exports.getAllSocket = function (cb) {

  Message.find({}).populate('user').then( (messages, err) => {
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
