var Kayz = require('../core');
var mongoose = require('mongoose');
var Node = mongoose.model('Node');
var lodash = require('lodash');
var Config = require('../config/config');

module.exports = function() {
  var bus = new Kayz.Bus(Config.redis);
  bus.online()
    .then(function(){
      return bus.subscribeTo('web_node', (message) => {
          if (lodash.isString(message)){
          message = JSON.parse(message);
          Node.findOne({'name': message.name})
            .then(function(node){
              if (node == undefined){
                node = new Node({
                  name: message.name,
                  nomad: {
                    installed: message.nomad.installed,
                    server: message.nomad.server,
                    client: message.nomad.client,
                    region: message.nomad.region
                  },
                  consul: {
                    installed: message.consul.installed,
                    server: message.consul.server,
                    client: message.consul.client
                  },
                  ip: message.ip,
                  label: '',
                  state: message.state,
                  cpu: message.cpu,
                  ram: message.ram
                });
                return node.save()
              }
              node.ip = message.ip;
              node.state = message.state;
              node.cpu = message.cpu;
              node.ram = message.ram;
              node.nomad.installed = message.nomad.installed;
              node.nomad.server = message.nomad.server;
              node.nomad.client = message.nomad.client;
              node.nomad.region = message.nomad.region;
              node.consul.installed = message.consul.installed;
              node.consul.server = message.consul.server;
              node.consul.client = message.consul.client;
              return node.save();
            })
            .catch(function(err){
              console.log('error in getNodeInfo: ', err);
            })
        }
      })
    })
    .catch(function(err){
      console.log('error: ', err);
    })
};
