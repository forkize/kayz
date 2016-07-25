var _ = require('lodash');

var util = require('util');

var Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

exports.waiters = {

  create: function (req, res, next) {
    var reqBody = req.body;

    var schema = Joi.object().keys({
      firstName: Joi.string().min(1).max(64).required(),
      lastName: Joi.string().min(1).max(64).required()
    });

    Joi.validate(reqBody, schema, function (err) {
      if (err) {
        return res.status(400).send({message: err});
      }
      return next();
    });
  }

};
