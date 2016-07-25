let mongoose = require('mongoose');

let Table = mongoose.model('Table');

exports.create = function(reqBody) {
  var newTable = new Table(reqBody);
  return newTable.save();
};

exports.assign = function(reqBody) {
  var waiterId = reqBody.waiterId;
  var tableId = reqBody.tableId;

  return Table.findByIdAndUpdate(tableId, {
    waiter: waiterId
  });
};

exports.list = function(reqBody) {
  var userId = reqBody.userId;

  return Table.find({waiter: userId});
};
