var User = require('../models/User');
var Message = require('../models/Message');


module.exports.create = function (req,res) {
  let data = req.body;
  console.log(data);

  let message = new Message();
  User.findOne({_id:data._id}).then( (user, err)=>{
    message.userId = user._id;
    message.text = data.message;
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

  Message.find({}).then( (messages, err)=>{
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      return res.json(messages);
    });
}
