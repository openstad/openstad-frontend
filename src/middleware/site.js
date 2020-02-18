const config = require('config');
const db = require('../db');
const createError = require('http-errors')
const sessionUser = require('./session_user');
const siteConfig = require('../lib/siteConfig');

module.exports = function( req, res, next ) {

	let siteId;

	// deze paden mogen dit overslaan
	if (req.path.match('^(/doc|/dev|/accepteer-cookies|/$)')) return next();
	if (req.path.match('^(/api/site(/[^/]*)?)$')) return next();

	let match = req.path.match(/\/site\/(\d+)?\//);
	if (match) {
		siteId = parseInt(match[1]);
	}
	if (!siteId || typeof siteId !== 'number') return next(new createError('400', 'Site niet gevonden'));
	//if (!siteId || typeof siteId !== 'number') return next();

	let where = {};
	where = { id: siteId }

	db.Site
		.findOne({ where })
		.then(function( found ) {
			if (!found) return next(new createError('400', 'Site niet gevonden'));
			//if (!found) return next();
			siteConfig.setFromSite(found);
			req.site = found;
			next();

		})
		.catch( err => {
			console.log('site not found:', siteId);
			next(err)
		});

}
