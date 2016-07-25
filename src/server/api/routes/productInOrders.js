var Router = require('express').Router;

module.exports = function (app, productInOrders) {
  var productInOrderRouter = new Router();
  productInOrderRouter
    .post('/', productInOrders.create)
    .put('/:productId', productInOrders.update);

  app.use('/productInOrders', productInOrderRouter);
};
