let productInOrderService;
function ProductInOrderHandler(productInOrders) {
  productInOrderService = productInOrders;
}

ProductInOrderHandler.prototype.create = (req, res, next) => {
  return productInOrderService.create(req.body)
    .then(function () {
      res.status(201).send({message: 'Product in order was successfully created.'});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'Internal server error.'});
    });
};

ProductInOrderHandler.prototype.update = function (req, res, next) {
  let productId = req.params.productId;

  return productInOrderService.update(productId, req.body)
    .then(function () {
      res.status(200).send({message: 'event successfully updated.'});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'internal server error.'});
    });
};

module.exports = ProductInOrderHandler;
