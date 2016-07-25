let mongoose = require('mongoose');

let Product = mongoose.model('Product');

exports.create = function(reqBody) {
  var newProduct = new Product(reqBody);
  return newProduct.save();
};

exports.list = function() {
  return Product.find();
};
