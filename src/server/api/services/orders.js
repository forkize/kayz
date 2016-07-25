let mongoose = require('mongoose');

let Order = mongoose.model('Order');

exports.create = function (reqBody) {
  var newOrder = new Order(reqBody);
  return newOrder.save();
};

exports.update = function (orderId, reqBody) {
  return Order
    .findByIdAndUpdate(orderId, reqBody);
};
