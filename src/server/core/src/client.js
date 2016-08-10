var Bus = require("./bus")
    ,Channels = require("./channels")
    ,request = require("request")
    ,lodash = require('lodash')
    ,execute = require('child_process').exec
    ,fs = require('fs')
    ,ip = require('ip')
    ,Promise = require('bluebird');

var _started = false;

function Client(name, redisHost){
    var self = this;
    self.name = name;
    self.nomad = false;
    self.consul = false;
    self.bus = new Bus(redisHost);
}

Client.prototype.init = function(){
    var self = this;
    self.bus.online(self)
        .then(function(){
            return self.AddSubs();
        })
        .then(function() {
            return self.GetInfo();
        })
        .then(function(data){
            return self.SendInfo(data);
        })
        .catch(function (err){
            console.log('error: ', err);
        })
};


Client.prototype.AddSubs = function(){
    var self = this;

    function _mainHandler(message){
        // FZ::TODO validate
        if(lodash.isString(message)) {
            message = JSON.parse(message);
        }
        var command;
        var stdoutMsg = {
            'exit': false,
            'error': false,
            'output': ''
        };
        var stderrMsg = {
            'exit': false,
            'error': true,
            'output': ''
        };
        var exitMsg = {
            'exit': true,
            'error': false,
            'output': ''
        };
        switch (message.type) {
            case 'exec':
                command = execute(message.command);
                command.stdout.on('data', function (data) {
                    console.log(data);
                    stdoutMsg.output = data;
		            if(data != undefined){
	        	        self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                    }
                });
                command.stderr.on('data', function (data) {
                    console.log(data);
                    stderrMsg.output = data;
                    if(data != undefined){
                        self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                    }
                });

                command.on('exit', function (code) {
                    console.log('child process exited with code ' + code);
                    exitMsg.output = code;
                    self.bus.publishTo(Channels.ConsoleResponse + message.id, exitMsg);
                });
                break;
            case 'nomad_agent':
                var c = parse_nomad_agent_command(message);
                fs.writeFile('./nomad_config.json', JSON.stringify(c[1], null, 2) , 'utf-8', function(){
                    command = execute(c[0]);

                    command.stdout.on('data', function (data) {
                        console.log(data);
                        stdoutMsg.output = data;
                        if(data != undefined){
                            self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                        }
                    });
                    command.stderr.on('data', function (data) {
                        console.log(data);
                        stderrMsg.output = data;
                        if(data != undefined){
                            self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                        }
                    });

                    command.on('exit', function (code) {
                        console.log('child process exited with code ' + code);
                        exitMsg.output = code;
                        self.bus.publishTo(Channels.ConsoleResponse + message.id, exitMsg);
                    });
                });
                break;
            case 'consul_agent':
                var c = parse_consul_agent_command(message);
                fs.writeFile('./consul_config.json', JSON.stringify(cfg, null, 2) , 'utf-8', function(){
                    command = execute(c[0]);
                    command.stdout.on('data', function (data) {
                        console.log(data);
                        stdoutMsg.output = data;
                        if(data != undefined){
                            self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                        }
                    });
                    command.stderr.on('data', function (data) {
                        console.log(data);
                        stderrMsg.output = data;
                        if(data != undefined){
                            self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                        }
                    });

                    command.on('exit', function (code) {
                        console.log('child process exited with code ' + code);
                        exitMsg.output = code;
                        self.bus.publishTo(Channels.ConsoleResponse + message.id, exitMsg);
                    });
                });
                break;
            case 'build':
                command = execute("sh build.sh");
                command.stdout.on('data', function (data) {
                    console.log(data);
                    stdoutMsg.output = data;
                    if(data != undefined){
                        self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                    }
                });
                command.stderr.on('data', function (data) {
                    console.log(data);
                    stderrMsg.output = data;
                    if(data != undefined){
                        self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                    }
                });

                command.on('exit', function (code) {
                    if (code == 0){
                        self.nomad = true;
                        self.consul = true;
                    }
                    console.log('child process exited with code ' + code);
                    exitMsg.output = code;
                    self.bus.publishTo(Channels.ConsoleResponse + message.id, exitMsg);
                });
                break;
            case 'run_job':
                /*fs.writeFile('./job.json', JSON.stringify(message.config, null, 2) , 'utf-8', function(){
                    command = execute('nomad run job.json');
                    command.stdout.on('data', function (data) {
                        console.log(data);
                        stdoutMsg.output = data;
                        if(data != undefined){
                            self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                        }
                    });
                    command.stderr.on('data', function (data) {
                        console.log(data);
                        stderrMsg.output = data;
                        if(data != undefined){
                            self.bus.publishTo(Channels.ConsoleResponse + message.id, stdoutMsg);
                        }
                    });

                    command.on('exit', function (code) {
                        console.log('child process exited with code ' + code);
                        exitMsg.output = code;
                        self.bus.publishTo(Channels.ConsoleResponse + message.id, exitMsg);
                    });
                });*/
                request({
                    url: "http://" + ip.address() + ":4646/v1/jobs",
                    method: "POST",
                    json: true,
                    body: {'Job': message.config}
                }, function (error, response, body){
                    console.log(response.status);
                });
                break;
        }
        if(!_started){
            if (message.error){
                console.log("[error] " + message.message);
                process.exit(1);
            }
            _started = true;
            console.log("[info] Kayz Client Started.");
        }
    }
    setTimeout(function(){
        self.ping();
    },1000);
    return self.bus.subscribeTo(self.name, _mainHandler);
};


Client.prototype.GetInfo = function() {
    var self = this;
    return new Promise(function(resolve, reject){
        var command1 =  execute('which nomad');

        command1.on('exit', function(code){
            if (parseInt(code) == 0){
                self.nomad = true;
            }
        });
        var command2 =  execute('which consul');

        command2.on('exit', function(code){
            if (parseInt(code) == 0){
                self.consul = true;
            }
        });
        return resolve({
            'name': self.name,
            'ip': ip.address()
        });
    });
};


Client.prototype.SendInfo = function(data){
    var self = this;
    return new Promise(function(resolve, reject){
        self.bus.publishTo(Channels.Master, data);
        resolve();
    });
};


//pinging master every 5 seconds
Client.prototype.ping = function() {
    var self = this;
    self.bus.publishTo(Channels.Ping, {
        'name': self.name,
        'nomad': self.nomad,
        'consul': self.consul
    });
    setTimeout(function(){
        self.ping(self);
    }, 5000);
};

function parse_nomad_agent_command(argument){
    var cmd = "nomad agent ";
    var cfg = {};
    if (argument.server) {
        cfg.server = {
            "enabled": true,
            "bootstrap_expect": argument.bootstrap
        };
    }
    if (argument.client) {
        cfg.client = {
            "enabled": true,
            "servers": argument.servers
        };
    }
    cfg.bind_addr = ip.address();
    cfg.data_dir = "/var/lib/nomad";
    cfg.advertise = {
        "http": ip.address() + ":4646",
        "rpc": ip.address() + ":4647",
        "serf": ip.address() + ":4648"
    };
    cfg.name = argument.node;
    cfg.region = argument.region;
    cfg.datacenter = argument.dc;
    cfg.consul = {
        "address": ip.address() + ":8500"
    };
    cmd += "-config nomad_config.json";
    return [cmd, cfg];
}

function parse_consul_agent_command(argument){
    var cmd = "consul agent -config-file consul_config.json";
    var cfg = {
        "datacenter": argument.dc,
        "data_dir": "/opt/consul",
        "log_level": "INFO",
        "node_name": argument.node,
        "bind_addr": ip.address(),
        "client_addr": ip.address()
    };
    if (argument.server){
        cfg.server = true;
        cfg.bootstrap_expect = argument.bootstrap;
    }
    return [cmd, cfg];
}

module.exports = Client;
