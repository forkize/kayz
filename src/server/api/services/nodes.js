let mongoose = require('mongoose');

let Node = mongoose.model('Node');

exports.find = function (queryData) {
    return Node
        .find(queryData);
};

exports.findById = function (nodeId) {
    return Node
        .findById(nodeId);
};