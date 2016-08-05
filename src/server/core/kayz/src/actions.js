var Server = require('./server')
    ,Client = require('./client')
    ,Bus = require('./bus')
    ,channels = require('./channels')
    ,request = require('request')
    ,promise = require('bluebird')
    ,_ = require('lodash');
var fs = require("fs");

exports.agent = function(options){
    // FZ::TODO validate options happi joi
    switch (options.mode) {
      case "server":
         var server = new Server(options.redis);
         server.init();
         break;
      case "client":
        var client = new Client(options.name, options.redis);
        client.init();
        break;
      default:
        console.log("Invalid Kayz agent mode. Should be 'server' or 'client'.")
    }
};

exports.exec = function(options){
    var id = Date.now();
    var bus = new Bus(options.redis);

    return new promise(function(resolve, reject){
        bus.online()
            .then(function(status){
                return bus.subscribeTo(channels.ConsoleResponse + id, function(message){
                    if (_.isString(message)){
                        message = JSON.parse(message);
                        if (message.exit){
                            return;
                        }
                        console.log(message.output);
                    }
                });
            })
            .then(function(status){
                bus.publishTo(channels.Console, {
                    "type": "exec",
                    "id": id,
                    "command": options.command,
                    "node": options.node
                });
                resolve({'bus': bus, 'id': id})
            })
            .catch(function(err){
                console.log('error: ', err);
                reject(err);
            });
    })
};

exports.nomad_agent = function(options){
    var bus = new Bus(options.redis);
    var id = Date.now();

    return new promise(function(resolve, reject){
        bus.online()
            .then(function(status){
                return bus.subscribeTo(channels.ConsoleResponse + id, function(message){
                    if (_.isString(message)) {
                        message = JSON.parse(message);
                        if (message.exit) {
                            return;
                        }
                        console.log(message);
                    }
                });
            })
            .then(function(status){
                bus.publishTo(channels.Console, {
                    "type": "nomad_agent",
                    "id": id,
                    "node": options.node,
                    "server": options.server,
                    "client": options.client,
                    "bootstrap": options.bootstrapExpect,
                    "dc": options.dc,
                    "region": options.region,
                    "join": options.join,
                    "servers": options.servers
                });
                resolve({'bus': bus, 'id': id});
            })
            .catch(function(err){
                console.log('error: ', err);
                reject(err);
            });
    });
};

exports.build = function(options){
    var bus = new Bus(options.redis);
    var id = Date.now();

    return new promise(function (resolve, reject) {
        bus.online()
            .then(function (status) {
                return bus.subscribeTo(channels.ConsoleResponse + id, function (message) {
                    if (_.isString(message)) {
                        message = JSON.parse(message);
                        if (message.exit) {
                            return;
                        }
                        console.log(message.output);
                    }
                });
            })
            .then(function(status){
                bus.publishTo(channels.Console, {
                    "type": "build",
                    "id": id,
                    "node": options.node
                });
                resolve({'bus': bus, 'id': id})
            })
            .catch(function (err) {
                console.log('error: ', err);
                reject(err);
            });
    });
};

exports.consul_agent = function(options){
    var bus = new Bus(options.redis);
    var id = Date.now();

    return new promise(function(resolve, reject){
        bus.online()
            .then(function (status) {
                return bus.subscribeTo(channels.ConsoleResponse + id, function(message){
                    if (_.isString(message)) {
                        message = JSON.parse(message);
                        if (message.exit) {
                            return;
                        }
                        console.log(message.output);
                    }
                });
            })
            .then(function(){
                bus.publishTo(channels.Console, {
                    "type": "consul_agent",
                    "id": id,
                    "node": options.node,
                    "server": options.server,
                    "client": options.client,
                    "bootstrap": options.bootstrapExpect,
                    "dc": options.dc,
                    "region": options.region
                });
                resolve({'bus': bus, 'id': id});
            })
            .catch(function (err) {
                console.log('error ', err);
                reject(err);
            });
    })
};

exports.run_job = function(options){
    var bus = new Bus(options.redis);
    var id = Date.now();

    return new promise(function(resolve, reject){
        bus.online()
            .then(function(){
                return bus.subscribeTo(channels.ConsoleResponse + id, function(message){
                    if (_.isString(message)) {
                        message = JSON.parse(message);
                        if (message.exit) {
                            return;
                        }
                        console.log(message.output);
                    }
                })
            })
            .then(function(){
                var config;
                fs.readFile('file', 'utf8', function (err, data) {
                    if (err) throw err;
                    config = JSON.parse(data);
                    bus.publishTo(channels.Console, {
                        'type': 'run_job',
                        'config': config
                    });
                    resolve({'bus': bus, 'id': id})
                });
            })
            .catch(function(err){
                console.log('Error: ', err);
                reject(err);
            })
    });
};

exports.test = function(options){

};
