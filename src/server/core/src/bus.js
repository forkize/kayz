/**
 * Created by David on 6/21/2016.
 */

var Busmq = require('busmq');
var Promise = require('bluebird');

function BusClass(redisHost) {
  var self = this;
  self.isOnline = false;
  self.bus = Busmq.create({"redis":redisHost});

  self.bus.on("offline", function(){
     self.isOnline = false;
  });

  self.bus.on("error", function(err){
     console.log("Bus error: ", err);
  });
}

BusClass.prototype.online = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        if(!self.isOnline) {
           self.bus.on("online", function(){
              self.isOnline = true;
              return resolve();
           });

           self.bus.connect();
        }
        else {
            return resolve();
        }
    });
};

BusClass.prototype.subscribeTo = function(channel, messageCallback){
    var self = this;

   return new Promise(function(resolve, reject){
        var sub = self.bus.pubsub(channel);
        sub.on('message', messageCallback);

        sub.on('subscribed', function() {
           resolve(true);
        });

        sub.on('error', function(err) {
           reject(err);
        });

        sub.subscribe();
   });
};

BusClass.prototype.publishTo = function(channel, message){
    var self = this;
     return new Promise(function(resolve, reject){
         var pub = self.bus.pubsub(channel);
         pub.publish(message, function(err) {
            if(err) {
              return reject(err);
            }
            resolve(true);
         });
     });
};

module.exports = BusClass;
