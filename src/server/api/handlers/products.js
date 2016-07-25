let productService;
function ProductHandler(products) {
  productService = products;
}

ProductHandler.prototype.create = (req, res, next) => {
  return productService.create(req.body)
    .then(function () {
      res.status(201).send({message: 'product was successfully created.'});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'Internal server error.'});
    });
};

ProductHandler.prototype.list = function (req, res, next) {
  return productService.list(req.body)
    .then(function (products) {
      res.status(200).send(products);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'internal server error.'});
    });
};

module.exports = ProductHandler;
