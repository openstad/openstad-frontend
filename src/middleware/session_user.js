var config       = require('config');
var pmx          = require('pmx');
var jwt          = require('jsonwebtoken');
const createError = require('http-errors');
const merge = require('merge');

var db           = require('../db');

var uidProperty  = config.get('security.sessions.uidProperty');
var cookieTTL    = config.get('security.sessions.cookieTTL');

db.User.findOne({where: {id: 1, role: 'unknown'}}).then(function( unknownUser ) {
	if( !unknownUser ) {
		console.error('User ID 1 must have role \'unknown\'');
		process.exit();
	}
});

module.exports = function getSessionUser( req, res, next ) {

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
	
	getUserInstance(userId || 1, req.site)
		.then(function( user ) {
			req.user = user;
			// Pass user entity to template view.
			res.locals.user = user;
			next();
		})
		.catch(next);

}

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

function getUserInstance( userId, site ) {

	return db.User.findByPk(userId)
		.then(function( dbuser ) {
			if( !dbuser ) {
				return db.User.findByPk(1);
			}
			return dbuser;
		})
		.then(function( dbuser ) {

			let user = dbuser;

			// fetch user data from mijnopenstad
			if (dbuser && dbuser.externalUserId && dbuser.externalAccessToken) {

				// get the user info using the access token
				let authServerUrl = ( site && site.config.oauth['auth-server-url'] ) || config.authorization['auth-server-url'];
				let authServerGetUserPath = ( site && site.config.oauth['auth-server-get-user-path'] ) || config.authorization['auth-server-get-user-path'];
				let authClientId = ( site && site.config.oauth['auth-client-id'] ) || config.authorization['auth-client-id'];
				let url = authServerUrl + authServerGetUserPath;
				url = url.replace(/\[\[clientId\]\]/, authClientId);

				// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMjdkM2E1Mi0zYzc0LTRlMjYtYTk2My1kMjcwMjhiM2M3ODEiLCJzdWIiOjEwOSwiZXhwIjoxNTYyOTI5ODAzLCJpYXQiOjE1NjI5MjYyMDN9.f4mPsAuzIO64IcU9ux73GmzGMCS68xiWrkKbENAnVPqcQAJ4kZf9Z8AVF7gd-HuUBxhOAd7LG1mEr_ggdvUmyhP2s9U2ZjRo_VBJoW8vJmDnTTkPYvAVcwV3TXpOY8UyPTBUYOfZxMiebwzUSbU9IEaXti__7YOTIs2zV_edoyJTw0QQJ4gSEYNuZ8_HRbHq-wJpZq0klSzY4L4mOkXwy6iqQqAiNjnWwa85Eso1zVIIKza0Qw4hXBhlKOaOEJjT3CQIOvC4X-vkztLa6FDzEEoPEyvCI-ckKPHfKZOtjjA7HXClrm6ZE5OeINzO3lznlNodrMXKGw-ExA3GzR1L8Q
				// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0N2QxMTVkNy0yMmUzLTQ4ZTMtOGFjYi00NDJiNGUzYjgyMmQiLCJzdWIiOjIzMSwiZXhwIjoxNTYyNjg4NDE1LCJpYXQiOjE1NjI2ODQ4MTV9.wKwhnwpzoXv-zRO2TRMQqzlv8MlZeh8oYMnj_D6a_rxmFYfaFkHr5FcYdgxfbG6NntNs8pKF-H_3WLhxnRgxK2S8je7uEHZHGCryZzCOY5W_XC1H2NOP8OrZNYRHY78E8gIWYhgoDoGfB9XwJ6MDrnb9w30NxLALEkkKCdcqEPunkZwiyfrXxq4STIEnYtXrjt7Hz-1qv3-a2q0ILildUZmB8Cx8soELozHuHj6TEO3Amh3O_JeWtVjsEHfEsaT9bL26RzipRcruhm_6W7_xyNtMTGJpSwCZQJRgjR6njQKLs-YRa1q6Dl7_rjDHSwQx9o2lntFJ87d9wOwUhseJ0Q
				
				return fetch(
					url, {
						method: 'get',
						headers: {
							authorization : 'Bearer ' + dbuser.externalAccessToken,
						},
						mode: 'cors',
					})
					.then(
						response => {
							if ( !response.ok ) throw new Error('Error fetching user')
							return response.json();
						},
						error => { throw createError(403, 'User niet bekend') }
					)
					.then(
						json => {
							json.role = json.role || 'member';
							user = merge(dbuser, json)
							return user;
						}
					)
					.catch(err => {
						console.log(err);
						return resetSessionUser(user);
					})

			} else {
				return user;
			}

		})
		.then(function( user ) {
			return user;
		})

}

function resetSessionUser(user) {

	return user.update({
		externalAccessToken: null
	})
		.then(user => {
			return db.User.findByPk(1);
		})
	
}
