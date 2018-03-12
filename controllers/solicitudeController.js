const formidable = require("formidable");
const fs = require("fs-extra");
const bcrypt = require("bcrypt");
const path = require("path");
var mongoose = require("mongoose");
const randomstring = require("randomstring");

var User = require('../models/User');
var Solicitude = require('../models/Solicitude');

module.exports.create = function (req, res) {
  let data = req.body;
  console.log(data);

  let solicitude = new Solicitude();
  solicitude.from = mongoose.Types.ObjectId(data.from);
  solicitude.to = mongoose.Types.ObjectId(data.to);

  solicitude.save(function (err, solicitude) {
        if(err){
          console.log(err);
          return res.sendStatus(503)
        }
        console.log(solicitude);
        return res.sendStatus(200);
    });
}

module.exports.getSolicitudeSent = function (req,res) {
  let data= req.query.id;
  Solicitude.find({from:data, status:'Sent'}).populate('to').then( (solicitudes, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      return res.json(solicitudes);
    });
}

module.exports.getSolicitudeSentMe = function (req,res) {
  let data= req.query.id;
  Solicitude.find({to:data, status:'Sent'}).populate('from').then( (solicitudes, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      return res.json(solicitudes);
    });
}

module.exports.acceptSolicitude = function (req,res) {
  let data= req.body;
  Solicitude.findOne({from:data.from, to:data.to, status:'Sent'}).then( (solicitude, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      solicitude.status = 'Accept';
      solicitude.save(function (err, solicitude) {
            if(err){
              console.log(err);
              return res.sendStatus(503)
            }
            return res.sendStatus(200);
        });
    });
}

module.exports.declineSolicitud = function (req,res) {
  let data= req.body;
  Solicitude.findOne({from:data.from, to:data.to, status:'Sent'}).then( (solicitude, err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
      solicitude.status = 'Decline';
      solicitude.save(function (err, solicitude) {
            if(err){
              console.log(err);
              return res.sendStatus(503)
            }
            return res.sendStatus(200);
        });
    });
}

module.exports.delete = function (req,res) {
  let data = req.body;
  Solicitude.remove({from:data.from, to:data.to}, function(err) {
      if (!err) {
        console.log(err);
      }
      console.log(
        'deleted'
      );
      res.sendStatus(200);
  });
}
