var Router = require('express').Router;

module.exports = function (app, tables) {
  var tableRouter = new Router();
  tableRouter
    .post('/', tables.create)
    .get('/', tables.list)
    .patch('/assign', tables.assign);

  app.use('/tables', tableRouter);
};
