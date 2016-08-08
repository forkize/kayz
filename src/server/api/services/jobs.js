let mongoose = require('mongoose');

let Job = mongoose.model('Job');

exports.find = function (queryData) {
    return Job
        .find(queryData);
};

exports.findById = function (jobId) {
    return Job
        .findById(jobId);
};