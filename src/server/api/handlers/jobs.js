/**
 * Created by david on 8/5/16.
 */
let jobService;
let Kayz = require('../../core/kayz');
function JobHandler(jobs) {
    jobService = jobs;
}

JobHandler.prototype.list = (req, res, next) => {
    let skip = 0;
    let limit = 10;
    let queryData = {};
    if (req.query.skip !== undefined){
        skip = parseInt(req.query.skip);
    }
    if (req.query.limit !== undefined){
        limit = parseInt(req.query.limit);
    }
    if (req.query.isActive !== undefined){
        queryData.isActive = req.query.isActive;
    }
    return jobService.find(queryData)
        .then(function(jobs){
            jobs = jobs.slice(skip, skip + limit);
            res.status(200).send({
                'jobs': jobs
            })
        })
        .catch(function(err){
            res.status(500).send({
                'message': err.message
            })
        });
};


JobHandler.prototype.create = (req, res, next) => {
    if (req.body.configuration == undefined){
        res.status(500).send({
            'message': 'there is no configuration file'
        });
        return;
    }
    var conf = JSON.parse(req.body.configuration);
    let bus = new Kayz.Bus('redis://40.76.39.65:6379');
    bus.online()
        .then(function(){
            return bus.publishTo(Kayz.Channels.Console, {
                'type': 'run_job',
                'config': conf
            })
        })
        .then(function(){
            res.status(200).send()
        })
        .catch(function(err){
            res.status(500).send({
                'message': err.message
            })
        })
};


Job.prototype.change_state = (req, res, next) => {
    jobService.findById(req.params.jobId)
        .then(function(job){
            if (job == undefined){
                res.status(404).send({
                    'message': 'there isn\'t job with that id'
                });
                return;
            }
            let bus = new Kayz.Bus('redis://40.76.39.65:6379');
            bus.online()
                .then(function(){
                    return bus.publishTo(Kayz.Channels.Console, {
                        'type': 'stop_job',
                        'name': job.name
                    })
                })
                .then(function(){
                    job.isActive = false;
                    return job.save();
                })
                .then(function(job){
                    res.status(200).send();
                })
                .catch(function(err){
                    res.status(500).send({
                        'message': err.message
                    })
                })
        })
};
module.exports = JobHandler;