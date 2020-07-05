var config  = require('config');

process.env.DEBUG = config.logging;

var datafile = process.env.NODE_ENV || 'development';

var db = require('./src/db');

db.sequelize.sync({force: true}).then(function() {
	
	return require(`./fixtures/${datafile}`)(db);
})
.catch(function( e ) {
	throw e;
})
.finally(function() {
	db.sequelize.close();
});
