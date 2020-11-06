const config = require('config');
const jwt = require('jsonwebtoken');
const merge = require('merge');
const fetch = require('node-fetch');
const db = require('../db');

/**
 * Get user from jwt or fixed token and validate with auth server
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async function getUser( req, res, next ) {
	try {
		if (!req.headers['x-authorization']) {
			return nextWithEmptyUser(req, res, next);
		}
		const userId = getUserId(req.headers['x-authorization']);
		const which = req.query.useOauth || 'default';
		const siteOauthConfig = (req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which]) || {};
		if(userId === null) {
			return nextWithEmptyUser(req, res, next);
		}

		const userEntity = await getUserInstance(userId, siteOauthConfig);
		req.user = userEntity
		// Pass user entity to template view.
		res.locals.user = userEntity;
		next();
  } catch(error) {
		console.error(error);
		next(error);
	}
}

/**
 * Continue with empty user if user is not set
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function nextWithEmptyUser(req, res, next) {
	req.user = {};
	res.locals.user = {};

	return next();
}

/**
 * UserId constructor function to set the userId and the flag fixed to indicate if this userId is an fixedToken or not.
 * @param id
 * @param fixed
 * @constructor
 */
function UserId(id, fixed) {
	this.id = id;
	this.fixed = fixed;
}

function getUserId(authorizationHeader) {
	const tokens = config && config.authorization && config.authorization['fixed-auth-tokens'];

	if (authorizationHeader.match(/^bearer /i)) {
		const jwt = parseJwt(authorizationHeader);
		return (jwt && jwt.userId) ? new UserId(jwt.userId, false) : null;
	}
	if (tokens) {
		const token = tokens.find(token => token.token === authorizationHeader);
		if (token) {
			return new UserId(token.userId, true);
		}
	}

	return null;
}

/**
 * get token from authorization header and parse jwt.
 * @param authorizationHeader
 * @returns {*}
 */
function parseJwt(authorizationHeader) {
	let token = authorizationHeader.replace(/^bearer /i, '');
	return jwt.verify(token, config.authorization['jwt-secret']);
}

/**
 * Get user from api database and auth server and combine to one user object.
 * @param user
 * @param siteOauthConfig
 * @returns {Promise<{}|{externalUserId}|*>}
 */
async function getUserInstance( user, siteOauthConfig ) {
	const dbUser = await db.User.findByPk(user.id);

	if (!dbUser || !dbUser.externalUserId || !dbUser.externalAccessToken) {
		return user.fixed ? dbUser : {};
	}

	// get the user info using the access token
	const authServerUrl = siteOauthConfig['auth-internal-server-url'] || config.authorization['auth-server-url'];
	const authServerGetUserPath = siteOauthConfig['auth-server-get-user-path'] || config.authorization['auth-server-get-user-path'];
	const authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
	const url = (authServerUrl + authServerGetUserPath).replace(/\[\[clientId\]\]/, authClientId);

	try {
		const response = await fetch(url, {
			method: 'get',
			headers: {
				authorization: 'Bearer ' + dbUser.externalAccessToken,
			},
			mode: 'cors',
		});

		if (!response.ok) {
			throw new Error('Error fetching user')
		}

		const authUser = response.json();

		authUser.role = authUser.role || user.role || 'member';

		return merge(dbUser, authUser);
	} catch(error) {
		// Todo: Do we always need to reset user token when an error occurs?
		console.error(error);
		return await resetUserToken(dbUser);
	}
}

/**
 * Resets external access token in the api database if user exists.
 * This token is used to authorize with the auth server
 * @param user
 * @returns {Promise<{}>}
 */
async function resetUserToken(user) {
  if (!( user && user.update )) return {};
	await user.update({
		externalAccessToken: null
	});

	return {};
}
