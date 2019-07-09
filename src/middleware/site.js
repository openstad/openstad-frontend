const config = require('config');
const db = require('../db');
const sessionUser = require('./session_user');

module.exports = function( req, res, next ) {

	let siteId;

	let match = req.path.match(/\/site\/(\d+)?\//);
	if (match) {
		siteId = parseInt(match[1]);
	} else {
		siteId = config.siteId;
	}
	if (!siteId) return next();

	let where = {};
	if (typeof siteId === 'number') {
		where = { id: siteId }
	} else {
		where = { name: siteId }
	}

	db.Site
		.findOne({ where })
		.then(function( found ) {
			if (!found) return next();

			req.site = found;
			next();

		})
		.catch( err => {
			console.log('site not found:', siteId);
			next(err)
		});

}
