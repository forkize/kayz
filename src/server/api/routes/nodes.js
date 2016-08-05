/**
 * Created by david on 8/5/16.
 */
var Router = require('express').Router;

module.exports = function (app, nodes) {
    var nodeRouter = new Router();
    nodeRouter
        .get('/', nodes.list)
        .get('/:nodeId', nodes.instance);

    app.use('/nodes', nodeRouter);
};