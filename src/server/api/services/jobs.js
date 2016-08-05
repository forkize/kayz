let mongoose = require('mongoose');

let Job = mongoose.model('Job');

exports.find = function (queryData) {
    return Job
        .find(queryData);
};

exports.finById = function (jobId) {
    return Job
        .findById(jobId);
};