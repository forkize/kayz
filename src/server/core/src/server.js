var Channels = require("./channels")
    ,request = require("request")
    ,lodash = require('lodash')
    ,debug = require('debug')('kayz::server')
    ,Bus = require('./bus')
    ,Cluster = require('./models/cluster')
    ,NodeItem = require('./models/nodeItem');



function Server(redisHost) {
    var self = this;
    self.bus = new Bus(redisHost);
}

Server.prototype.init = function () {
    var self = this;
    self.bus.online()
        .then(function(){
            return self.SubscribeToMasterChannel();
        })
        .then(function(){
            return self.SubscribeToPingChannel();
        })
        .then(function(){
            return self.SubscribeToCommmandChannel();
        })
        .then(function(){
            Cluster.CheckNodes(self.bus);
            Cluster.getNodeInfo(self.bus);
            Cluster.getJobInfo(self.bus);
        })
        .catch(function(err){
            debug('Error: ', err);
        });
};


// adding Subscriptions
Server.prototype.SubscribeToMasterChannel = function(){
    var self = this;

    function _masterHandler(message) {
      // FZ::TODO validate
      if(lodash.isString(message)) {
        message = JSON.parse(message);
      }

      debug(message);
      var successMsg = {"error": false};

      var nodeItem = Cluster.getNode(message.name);
      if(!nodeItem) {
         //  if there is no such node then add node to cluster
         var newNodeItem = new NodeItem(message.name,message.ip);
         newNodeItem.setState(true);
         Cluster.addNode(newNodeItem);
         self.bus.publishTo(newNodeItem.getName(), successMsg);
         self.bus.publishTo(Channels.WebNode, newNodeItem);
      }
      else {
        if(nodeItem.getState()) {
            // if there is an active node with same name then return error
            var errMsg = {"error": true, "message": "Node with that name already exists."};
            self.bus.publishTo(message.name, errMsg);
        }
        else {
          // if there is a node with same name but not active
          nodeItem.setIp(message.ip);
          nodeItem.setState(true);
          self.bus.publishTo(Channels.WebNode, nodeItem);
          self.bus.publishTo(nodeItem.getName(), successMsg);
        }
      }
    }

    return self.bus.subscribeTo(Channels.Master, _masterHandler);
};


Server.prototype.SubscribeToPingChannel = function(){
    var self = this;

    function _pingHandler(message){
        // FZ::TODO validate
        if(lodash.isString(message)) {
            message = JSON.parse(message);
        }
        var nodeItem = Cluster.getNode(message.name);
        if(nodeItem != undefined) {
            nodeItem.setState(true);
            nodeItem.nomad.installed = message.nomad;
            nodeItem.consul.installed = message.consul;
        }
        self.bus.publishTo(Channels.WebNode, nodeItem);
    }
    return self.bus.subscribeTo(Channels.Ping, _pingHandler);
};


Server.prototype.SubscribeToCommmandChannel = function(){
    var self = this;

    function _consoleHandler(message){
        // FZ::TODO validate
        if(lodash.isString(message)) {
            message = JSON.parse(message);
        }

        var errMsg = {
            "error": true,
            "message": "There isn't node with that name."
        };

        switch (message.type) {
            case 'run_job':
                var region = message.config.Job.Region;
                var nodeItem = Cluster.getNodebyRegion(region);
                if (nodeItem){
                    self.bus.publishTo(nodeItem.getName(), message);
                    return;
                }
                errMsg.message = 'There isn\'t nomad server in that region';
                self.bus.publishTo(Channels.ConsoleResponse + message.id, errMsg);
                break;
            case 'get_nodes':
                var msg = {
                    'nodes': Cluster.nodes
                };
                self.bus.publishTo(Channels.ConsoleResponse + message.id, msg);
                break;
            default:
                var nodeItem = Cluster.getNode(message.node);
                if(nodeItem.getState()) {
                    switch(message.type) {
                        case "nomad_agent" :
                            if (!nodeItem.nomad.installed){
                                errMsg.message = 'nomad doesn\'t installed in that node';
                                self.bus.publishTo(Channels.ConsoleResponse + message.id, errMsg);
                                return;
                            }
                            var servers = message.servers.split(",");
                            message.servers = Cluster.getIps(servers);
                            nodeItem.nomad.server = message.server;
                            nodeItem.nomad.client = message.client;
                            nodeItem.nomad.region = message.region;
                            self.bus.publishTo(Channels.WebNode, nodeItem);
                            break;
                        case 'consul_agent':
                            if (!nodeItem.consul.installed){
                                errMsg.message = 'consul doesn\'t installed in that node';
                                self.bus.publishTo(Channels.ConsoleResponse + message.id, errMsg);
                                return;
                            }
                            nodeItem.consul.server = message.server;
                            nodeItem.consul.client = message.client;
                            self.bus.publishTo(Channels.WebNode, nodeItem);
                    }

                    self.bus.publishTo(nodeItem.getName(), message);
                }

                self.bus.publishTo(Channels.ConsoleResponse + message.id, errMsg);
        }

    }

    console.log('[info] Kayz server started.');
    return self.bus.subscribeTo(Channels.Console, _consoleHandler);
};

module.exports = Server;
