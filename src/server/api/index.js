'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var reflection = require('../lib/reflection');
var app = module.exports = express();

var fileList = [
  'nodes',
  'jobs'
];

function initializeRoutes() {
  fileList.forEach(function (fileName) {
    initializeRoute(fileName + '.js');
  });
}

function initializeRoute(route) {
  var router = require('./routes/' + route);

  var routerParams = [app].concat(getHandlers(router));

  router.apply(router, routerParams);
}

function getHandlers(router) {
  var handlers = reflection.getParamNames(router);
  if (handlers[0] === 'app') {
    handlers.shift();
  }

  return handlers.map(function (handler) {
    return getHandlerInstance(require('./handlers/' + handler));
  });
}

function getHandlerInstance(handlerConstructor) {
  var params = reflection.getParamNames(handlerConstructor)
    .map(function (dep) {
      return require('./services/' + dep);
    });

  return construct(handlerConstructor, params);
}

function construct(constructor, args) {
  function F() {
    constructor.apply(this, args);
  }

  F.prototype = constructor.prototype;
  return new F();
}


app.use(function (req, res, next) {
  req.app = app;
  next();
});

console.log('initializing api routes');
initializeRoutes();
