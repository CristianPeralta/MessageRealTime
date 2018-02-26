var Room = require('../models/Room');
var mongoose = require("mongoose");


module.exports.create = function (req,res) {
  let data = req.body;
  console.log(data);

  let room = new Room();
  room.name = data.name;
  room.save(function (err, room) {
        if(err){
          console.log(err);
          return res.sendStatus(503)
        }
        return res.json(room);
    });
}

module.exports.getAll = function (req,res) {
  Room.find({}).then( (rooms, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      return res.json(rooms);
    });
}
