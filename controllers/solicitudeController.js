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
  console.log('solicitudes');
  let solicitude = new Solicitude();
  solicitude.from = mongoose.Types.ObjectId(data.user._id);
  solicitude.to = mongoose.Types.ObjectId(data.friend._id);

  solicitude.save(function (err, solicitude) {
        if(err){
          console.log(err);
          return res.sendStatus(503)
        }
        console.log(solicitude);
        User.findOne({_id:solicitude.from}).then((user, err) => {
          if(err){
            console.log(err);
            return res.sendStatus(503)
          }
          user.solicitudes.push(mongoose.Types.ObjectId(solicitude._id));
          user.save((err, user) => {
            if(err){
              console.log(err);
              return res.sendStatus(503)
            }
            User.findOne({_id:user._id}).populate({
              path: 'friends',
              populate: {path: 'friends'}
            }).populate({
              path: 'solicitudes',
              populate: [
                {path: 'from'},
                {path: 'to'}
              ],
            }).then((user, err) => {
              if(err){
                console.log(err);
                return res.sendStatus(503)
              }
              User.findOne({_id:data.friend._id}).populate({
                path: 'friends',
                populate: {path: 'friends'}
              }).populate({
                path: 'solicitudes',
                populate: [
                  {path: 'from'},
                  {path: 'to'}
                ],
              }).then((friend, err) => {
                if(err){
                  console.log(err);
                  return res.sendStatus(503)
                }
                friend.solicitudes.push(mongoose.Types.ObjectId(solicitude._id));
                friend.save((err, friend) => {
                  if(err){
                    console.log(err);
                    return res.sendStatus(503)
                  }
                  req.session.user = user;
                  let currentUser = req.session.user;
                  return res.json(currentUser);
                })
              })
            })
          })
        })
    });
}

module.exports.createSocket = function (data, cb) {
  console.log(data);
  console.log('solicitudes');
  let solicitude = new Solicitude();
  solicitude.from = mongoose.Types.ObjectId(data.user._id);
  solicitude.to = mongoose.Types.ObjectId(data.friend.user._id);

  solicitude.save(function (err, solicitude) {
        if(err){
          return cb(solicitude, err);
        }
        console.log(solicitude);
        User.findOne({_id:solicitude.from}).then((user, err) => {
          if(err){
            return cb(solicitude, err);
          }
          user.solicitudes.push(mongoose.Types.ObjectId(solicitude._id));
          user.save((err, user) => {
            if(err){
              return cb(solicitude, err);
            }
            User.findOne({_id:user._id}).populate({
              path: 'friends',
              populate: {path: 'friends'}
            }).populate({
              path: 'solicitudes',
              populate: [
                {path: 'from'},
                {path: 'to'}
              ],
            }).then((user, err) => {
              if(err){
                return cb(solicitude, err);
              }
              User.findOne({_id:data.friend.user._id}).populate({
                path: 'friends',
                populate: {path: 'friends'}
              }).populate({
                path: 'solicitudes',
                populate: [
                  {path: 'from'},
                  {path: 'to'}
                ],
              }).then((friend, err) => {
                if(err){
                  return cb(solicitude, err);
                }
                friend.solicitudes.push(mongoose.Types.ObjectId(solicitude._id));
                friend.save((err, friend) => {
                  if(err){
                    return cb(solicitude, err);
                  }
                  Solicitude.findOne({_id:solicitude._id}).populate('to').populate('from').then((solicitude, err) => {
                    if (err) {
                      return cb(solicitude, err);
                    }
                    return cb(solicitude, err);
                  })
                })
              })
            })
          })
        })
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



module.exports.acceptSocket = function (data, cb) {
  Solicitude.findOne({_id:data.id}).populate('from').populate('to').then( (solicitude, err) => {
      if (err) {
        console.log(err);
        return cb(solicitude, err)
      }
      solicitude.status = 'Accept';
      solicitude.save(function (err, solicitude) {
        User.findOne({_id:solicitude.to._id}).then((user, err) => {
          if(err){
            return cb(solicitude, err)
          }
          User.findOne({_id:solicitude.from._id}).then((friend, err) => {
            if(err){
              return cb(solicitude, err)
            }
            if (user.friends.indexOf(mongoose.Types.ObjectId(friend._id)) == -1) {
              user.friends.push(mongoose.Types.ObjectId(friend._id));
              user.save(function (err,user) {
                if(err){
                  return cb(solicitude, err)
                }
                User.findOne({_id:user._id}).populate({
                  path: 'friends',
                  populate: {path: 'friends'}
                }).populate({
                  path: 'solicitudes',
                  populate: [
                    {path: 'from'},
                    {path: 'to'}
                  ],
                }).then((user, err) => {
                  if(err){
                    console.log(err);
                    return res.sendStatus(503)
                  }
                  return cb(user, err)
                })
              });
            }

          })

        })
          return cb(solicitude, err)
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
  console.log('deleting solicitude' );
  let data = req.body;
  Solicitude.remove({_id:data.id}, function(err) {
      if (err) {
        console.log(err);
      }
      console.log(
        'deleted'
      );
      res.sendStatus(200);
  });
}

module.exports.deleteSocket = function (data, cb) {
  console.log('deleting solicitude' );
  Solicitude.remove({_id:data.id}, function(err) {
      return cb(err);
  });
}
