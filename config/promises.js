var config  = require('config');
var Promise = require('bluebird');

if( config.get('debug') ) {
	Promise.longStackTraces();
}