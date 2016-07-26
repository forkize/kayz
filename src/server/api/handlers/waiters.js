let waiterService;
function WaiterHandler(waiters) {
  waiterService = waiters;
}

WaiterHandler.prototype.create = (req, res, next) => {
  return waiterService.create(req.body)
    .then(function () {
      res.sendStatus(201);
    })
    .catch(function (err) {
      console.log(err);
      res.sendStatus(500);
    });
};

WaiterHandler.prototype.list = (req, res, next) => {
  return waiterService.list(req.body)
    .then(function (waiters) {
      res.status(200).send(waiters);
    })
    .catch(function (err) {
      console.log(err);
      res.sendStatus(500);
    });
};

module.exports = WaiterHandler;
