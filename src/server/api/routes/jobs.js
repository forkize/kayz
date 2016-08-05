/**
 * Created by david on 8/5/16.
 */
var Router = require('express').Router;

module.exports = function (app, jobs) {
    var jobRouter = new Router();
    jobRouter
        .get('/jobs', jobs.list)
        .post('/job', jobs.create)
        .patch('/jobs/isActive', jobs.change_state);

    app.use('/', jobRouter);
};