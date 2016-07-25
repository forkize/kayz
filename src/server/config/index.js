var config = require('./config');
var env = process.env.NODE_ENV || 'local';

module.exports = config[env];



