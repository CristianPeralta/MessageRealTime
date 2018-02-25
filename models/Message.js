var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  text: {type:String},
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
  createdAt:{ type: Date, default: Date.now}
});

var Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
