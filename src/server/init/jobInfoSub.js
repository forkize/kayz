/**
 * Created by david on 8/4/16.
 */
var Kayz = require('../core');
var mongoose = require('mongoose');
var Job = mongoose.model('Job');
var lodash = require('lodash');
var Config = require('../config/config');

module.exports = function(){
  console.log(Config);
  var bus = new Kayz.Bus(Config.redis);
  bus.online()
    .then(function(){
      return bus.subscribeTo('web_job', function(message){
        if (lodash.isString(message)){
          message = JSON.parse(message);
          Job.findOne({'name': message.Name})
            .then(function(job){
              if (!job){
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
