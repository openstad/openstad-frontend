const config = require('config');
const db = require('../db');
const createError = require('http-errors')
const sessionUser = require('./session_user');

module.exports = function( req, res, next ) {

	let siteId;

	let match = req.path.match(/\/site\/(\d+)?\//);
	if (match) {
		siteId = parseInt(match[1]);
	}
	if (!siteId || typeof siteId !== 'number') return next(new createError('400', 'Site niet gevonden'));

	let where = {};
	where = { id: siteId }

	db.Site
		.findOne({ where })
		.then(function( found ) {
			if (!found) return next(new createError('400', 'Site niet gevonden'));

			req.site = found;
			next();

		})
		.catch( err => {
			console.log('site not found:', siteId);
			next(err)
		});

}
