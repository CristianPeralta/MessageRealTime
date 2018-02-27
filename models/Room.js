var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  name: {type:String, unique: true},
  slug: {type:String, unique: true},
  createdAt:{ type: Date, default: Date.now}
});

var Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
