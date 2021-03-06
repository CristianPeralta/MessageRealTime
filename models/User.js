var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type:String, unique: true, required:'Username is required'},
  email: {type:String, unique: true, required:'Email is required'},
  password: {type:String, required:'Password is required'},
  photo: {type:String},
  gender: {type: String},
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  solicitudes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Solicitude'
  }],
  createdAt:{ type: Date, default: Date.now}
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
