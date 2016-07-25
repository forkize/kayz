let mongoose = require('mongoose');

let ProductInOrder = mongoose.model('ProductInOrder');

exports.create = function(reqBody){
  var newProductInOrder = new ProductInOrder(reqBody);
  return newProductInOrder.save();
};

exports.update = function(productInOrderId, reqBody) {
  return ProductInOrder.findByIdAndUpdate(productInOrderId, reqBody);
};