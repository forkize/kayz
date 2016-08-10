function NodeItem(name, ip) {
  this.name = name;
  this.ip = ip;
  this.state = false;
  this.last_check = null;
  this.nomad = {
    'installed': false,
    'server': false,
    'client': false,
    'region': ''
  };
  this.consul = {
    'installed': false,
    'server': false,
    'client': false
  };
  this.cpu = '';
  this.ram = '';

  this.setState = function(val) {
      this.last_check = Date.now();
      this.state = val;
  };

  this.getState = function() {
      return this.state;
  };

  this.getName = function () {
    return this.name;
  };

  this.setIp = function(ipVal) {
    this.ip = ipVal;
  };
  this.getIp = function() {
    return this.ip;
  };
}

module.exports = NodeItem;
