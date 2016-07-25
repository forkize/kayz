var Router = require('express').Router;

module.exports = function (app, orders) {
  var orderRouter = new Router();
  orderRouter
    .post('/', orders.create);

  app.use('/orders', orderRouter);
};
