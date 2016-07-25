let tableService;
function TableHandler(tables) {
  tableService = tables;
}

TableHandler.prototype.create = (req, res, next) => {
  return tableService.create(req.body)
    .then(function () {
      res.status(201).send({message: 'Table was successfully created.'});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'Internal server error.'});
    });
};

TableHandler.prototype.assign = function (req, res, next) {
  return tableService.assign(req.body)
    .then(function () {
      res.status(200).send({message: 'Table was successfully assigned to the waiter.'});
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'internal server error.'});
    });
};

TableHandler.prototype.list = function (req, res, next) {

  return tableService.list(req.body)
    .then(function (events) {
      res.status(200).send(events);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send({message: 'internal server error.'});
    });
};

module.exports = TableHandler;
