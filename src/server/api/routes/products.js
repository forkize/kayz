var Router = require('express').Router;

module.exports = function (app, products) {
  var productRouter = new Router();
  productRouter
    .post('/', products.create)
    .get('/', products.list);

  app.use('/products', productRouter);
};
