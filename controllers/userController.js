var User = require('../models/User');

module.exports.create = function (req,res) {
  var data = req.body;
  console.log(data);
  var newUser = new User(data);
  newUser.save(function (err, user) {
    if (err) return res.status(500).send(err);
    return res.json(user);
  })
}
