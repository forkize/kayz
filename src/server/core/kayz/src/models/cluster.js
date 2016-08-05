var request = require("request");
var Channels = require("../channels.js");
function Cluster() {
    this.nodes = [];
}

Cluster.prototype.addNode = function(node) {
    this.nodes.push(node);
};

Cluster.prototype.getNode = function(name) {
  var self = this;
  for (var ind in self.nodes) {
      var nodeItem = self.nodes[ind];
      if (name == nodeItem.getName()){
          return nodeItem;
      }
  }
};

//
Cluster.prototype.getIps = function(nodeArray) {
  var self = this;
  var ipsArray = [];

  for(var ind in nodeArray) {
    var nodeItemName = nodeArray[ind];
    var nodeItem = self.getNode(nodeItemName);
    if(nodeItem) {
      ipsArray.push(nodeItem.getIp());
    }
  }
};

Cluster.prototype.CheckNodes = function(bus) {
    var self = this;
    self.nodes.forEach(function(nodeItem){
        if (Date.now() - nodeItem.last_check >= 6000 && nodeItem.getState()){
            nodeItem.setState(false);
            console.log("[info] Signal from client " + nodeItem.getName() + " doesn't coming.")
            bus.publishTo(Channels.WebNode, nodeItem);
        }
    });
    setTimeout(function(){
        self.CheckNodes(bus);
    }, 6000)
};


Cluster.prototype.getNodeInfo = function () {
    var self = this;
    self.nodes.forEach(function(nodeItem){
        if (nodeItem.state){
            request.get('http://' + nodeItem.getIp() + ":4646/v1/client/stats", function (error, response, body) {
                var cpu = 0, ram = 0;
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    body.CPU.forEach(function(c){
                        cpu += c.Idle;
                    });
                    cpu = cpu/body.CPU.length;
                    ram = 100*body.Memory.Available/body.Memory.Total;
                    nodeItem.cpu = cpu;
                    nodeItem.ram = ram;
                    console.log(nodeItem.cpu, nodeItem.ram)
                }
            });
        }
    });
    setTimeout(self.getNodeInfo.bind(this), 1000)
};


Cluster.prototype.getJobInfo = function(bus){
    var self = this;
    self.nodes.forEach(function(nodeItem){
        if(nodeItem.nomad.server){
            request.get('http://' + nodeItem.getIp() + ":4646/v1/jobs", function(error, response, body){
                console.log(body);
                if(!error && response.statusCode == 200){
                    var jobs = JSON.parse(body);
                    jobs.forEach(function(jobItem){
                        bus.publishTo(Channels.WebJob, jobItem);
                    })
                }
            })
        }
    });
    setTimeout(function(){
        self.getJobInfo(bus);
    }, 1000)
};

Cluster.prototype.getNodebyRegion = function(region) {
    var self = this;
    for (var ind in self.nodes) {
        if (self.nodes[ind].getState() && self.nodes[ind].nomad.region == region && self.nodes[ind].nomad.server){
            return self.nodes[ind];
        }
    }
};
module.exports = new Cluster();
