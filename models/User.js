var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type:String, required:'Username is required'},
  email: {type:String, required:'Email is required'},
  password: {type:String, required:'Password is required'},
  createdAt:{ type: Date, default: Date.now}
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
