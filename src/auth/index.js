var config     = require('config');
var roles      = config.get('security.authorization.roles');
module.exports = require(`./roles/${roles}`);

