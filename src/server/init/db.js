var modelList = [
  'Node',
  'Job'
];

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var connection = mongoose.connection;

var dbInitialized = false;

module.exports = function (config) {
  var dbURL = config.db;

  //Preventing the module to be initialize more than one time
  if (dbInitialized) {
    return;
  }
  dbInitialized = true;

  //Connecting to the database
  console.log('initializing database connection');
  mongoose.connect(dbURL);
  
  connection.on('connected', function () {
    console.log('Mongo::connected ');
  });
  connection.on('disconnected', function () {
    console.log('Mongo::disconnected');
  });


  connection.once('open', function () {
    console.log('connected');
  });

  connection
    .on('connected', function () {
      console.log('Mongoose default connection open to ' + dbURL);
    })
    .on('error', function (err) {
      console.log('Mongoose default connection error: ' + err);
    })
    .on('disconnected', function () {
      console.log('Mongoose default connection disconnected');
    });

  process.on('SIGINT', function () {
    connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

  //Set debug mode for dev environment
  var env = process.env.NODE_ENV || 'local';
  if (env === 'development') {
    mongoose.set('debug', true);
  }

  //Init model models
  console.log('initializing model models');

  modelList.forEach(function (modelFile) {

    require('../models/' + modelFile + '.js');
    console.log('model schema initialized: %s', modelFile);

  });
};
