const config = require('config');
const db = require('../db');

module.exports = function( app ) {
	app.use(function( req, res, next ) {
		res.set({
			'X-Frame-Options': 'deny'
		});
		next();
	});

};
