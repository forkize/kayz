/**
 * Created by david on 8/4/16.
 */
var Kayz = require('../core/kayz');
var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var lodash = require('lodash');

module.exports = function(){
  var bus = new Kayz.Bus('redis://40.76.39.65:6379');
  bus.online()
    .then(function(){
      return bus.subscribeTo('web_job', function(message){
        if (lodash.isString(message)){
          message = JSON.parse(message);
          Job.findOne({'name': message.Name})
            .then(function(job){
              if (job == undefined){
                job = new Job({
                  name: message.Name,
                  isActive: true
                });
                return job.save();
              }
            })
            .catch(function(err){
              console.log(err);
            })
        }
      })
    })
    .catch(function(err){
      console.log('Error in getJobInfo: ', err.message);
    })
};
