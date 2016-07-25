let mongoose = require('mongoose');

let Waiter = mongoose.model('Waiter');

exports.create = function(reqBody) {
  var newWaiter = new Waiter(reqBody);
  return newWaiter.save();
};

exports.list = function() {
  return Waiter.find();
};
