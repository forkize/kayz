var Router = require('express').Router;
var validations = require('../middleware/validations').waiters;

module.exports = function (app, waiters) {
  var waiterRouter = new Router();
  waiterRouter
    .post('/', validations.create, waiters.create)
    .get('/', waiters.list);

  app.use('/waiters', waiterRouter);
};
