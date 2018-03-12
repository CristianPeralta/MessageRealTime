var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SolicitudeSchema = new Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{type: String, default: 'Sent'},
  createdAt:{ type: Date, default: Date.now}
});

var Solicitude = mongoose.model("Solicitude", SolicitudeSchema);

module.exports = Solicitude;
