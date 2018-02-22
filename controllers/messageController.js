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

module.exports.getAll = function (req,res) {

  Message.find({}).populate('user').then( (messages, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      console.log(messages);
      return res.json(messages);
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
