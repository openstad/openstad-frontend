var config       = require('config');
var NodeCache    = require('node-cache');
var pmx          = require('pmx');
var jwt          = require('jsonwebtoken');

var db           = require('../db');

var uidProperty  = config.get('security.sessions.uidProperty');
var cookieTTL    = config.get('security.sessions.cookieTTL');
var userCacheTTL = config.get('security.sessions.userCacheTTL');

var userCache = new NodeCache({
	stdTTL    : userCacheTTL,
	useClones : false
});

// PM2 trigger
// -----------
pmx.action('flushUserCache', function( reply ) {
	userCache.flushAll();
	reply(userCache.getStats());
});

db.User.findOne({where: {id: 1, role: 'unknown'}}).then(function( unknownUser ) {
	if( !unknownUser ) {
		console.error('User ID 1 must have role \'unknown\'');
		process.exit();
	} else {
		// The unknown user stays cached forever.
		userCache.set(1, unknownUser, 0);
	}
});

module.exports = function( app ) {

	app.use(function getSessionUser( req, res, next ) {
		req.setSessionUser   = setSessionUser.bind(req);
		req.unsetSessionUser = unsetSessionUser.bind(req);
		
		if( !req.session ) {
			return next(Error('express-session middleware not loaded?'));
		}

		let userId = req.session[uidProperty];

		if (req.headers['x-authorization']) {

			// jwt overrules other settings
			if (req.headers['x-authorization'].match(/^bearer /i)) {
				// jwt overrules other settings
				let token = req.headers['x-authorization'].replace(/^bearer /i, '');
				let data = jwt.verify(token, config.authorization['jwt-secret'])
				if (data && data.userId) {
					userId = data.userId
				}
			}

			// auth token overrules other settings
			let tokens = config && config.authorization && config.authorization['fixed-auth-tokens'];
			if (tokens) {
				tokens.forEach((token) => {
					if ( token.token == req.headers['x-authorization'] ) {
						userId = token.userId;
					}
				});
			}

		}
			
		getUserInstance(userId || 1)
			.then(function( user ) {
				req.user = user;
				// Pass user entity to template view.
				res.locals.user = user;
				next();
			})
			.catch(next);

	});
};

function setSessionUser( userId, originUrl ) {
	// The original `maxAge` is 'session', but now the user wants to
	// stay logged in.
	this.session.cookie.maxAge = cookieTTL;
	this.session[uidProperty] = userId;
	if( originUrl ) {
		this.session['ref'] = originUrl;
	}
}

function unsetSessionUser() {
	this.session.cookie.maxAge = null;
	this.session[uidProperty]  = null;
	this.session['ref']        = null;
}

function getUserInstance( userId ) {
	var user = userCache.get(userId);
	if( user ) {
		// Update cached item's TTL.
		userCache.ttl(userId);
		return Promise.resolve(user);
	} else {

		return db.User.findByPk(userId)
			.then(function( user ) {
				if( !user ) {
					return db.User.findByPk(1);
				}

			userCache.set(userId, user);
			return user;
		});
	}
}

