let orderService;
function OrderHandler(orders) {
  orderService = orders;
}

OrderHandler.prototype.create = (req, res, next) => {
  return orderService.create(req.body)
    .then(function () {
      res.status(201).send({message: 'Order was successfully created.'});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'Internal server error.'});
    });
};

module.exports = OrderHandler;
