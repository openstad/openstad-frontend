var log = require('debug')('app:http:activity');

module.exports = function( app ) {
	app.use(function( req, res, next ) {
		var url      = req.originalUrl;
		var method   = req.method;
		var userId   = req.user.id;
		var userRole = req.user.role;
		log(`${method} "${url}" ${userRole}(${userId})`);
		next();
	});
};