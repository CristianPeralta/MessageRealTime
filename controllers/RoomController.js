var Room = require('../models/Room');
var mongoose = require("mongoose");


module.exports.room = function (req,res) {
  let callroom = req.params.room;
  Room.findOne({slug: callroom}).then( (room, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      return res.json(room);
    });
}

module.exports.create = function (req,res) {
  let data = req.body;
  console.log(data);

  let room = new Room();
  room.name = data.name;
  room.slug = string_to_slug(data.name);
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

module.exports.delete = function (req,res) {

  Room.remove({}, function(err) {
      if (!err) {
        console.log(err);
      }
      console.log(
        'deleted'
      );
      res.json('deleted')
  });
}

function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}
