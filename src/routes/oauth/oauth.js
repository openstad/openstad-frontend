const Sequelize = require('sequelize');
const express = require('express');
const createError = require('http-errors');
const fetch = require('isomorphic-fetch');
const jwt = require('jsonwebtoken');
const config = require('config');
const db = require('../../db');

let router = express.Router({mergeParams: true});

// all: add site
// -------------
router
	.all('*', function(req, res, next) {

		let siteId;

		let match = req.path.match(/\/site\/(\d+)?/);
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
				req.site = found;
				next();
			})
			.catch( err => {
				console.log('site not found:', siteId);
				next(err)
			});

	})

// inloggen 1
// ----------
router
	.route('(/site/:siteId)?/login')
	.get(function( req, res, next ) {

		if (req.query.redirectUrl) {
			req.session.returnTo = req.query.redirectUrl;
		}

		req.session.save(() => {
			let authServerUrl = ( req.site && req.site.config.oauth['auth-server-url'] ) || config.authorization['auth-server-url'];
			let authServerLoginPath = ( req.site && req.site.config.oauth['auth-server-login-path'] ) || config.authorization['auth-server-login-path'];
			let authClientId = ( req.site && req.site.config.oauth['auth-client-id'] ) || config.authorization['auth-client-id'];
			let url = authServerUrl + authServerLoginPath;
			url = url.replace(/\[\[clientId\]\]/, authClientId);
			url = url.replace(/\[\[redirectUrl\]\]/, config.url + '/oauth/digest-login');

			res.redirect(url);

		});
	});

// inloggen 2
// ----------
router
	.route('(/site/:siteId)?/digest-login')
	.get(function( req, res, next ) {

		// use the code to get an access token
		let code = req.query.code;

		// TODO: meer afvangingen en betere response
		if (!code) throw createError(403, 'Je bent niet ingelogd');

		let authServerUrl = ( req.site && req.site.config.oauth['auth-server-url'] ) || config.authorization['auth-server-url'];
		let authServerExchangeCodePath = ( req.site && req.site.config.oauth['auth-server-exchange-code-path'] ) || config.authorization['auth-server-exchange-code-path'];
		let url = authServerUrl + authServerExchangeCodePath;

		let authClientId = ( req.site && req.site.config.oauth['auth-client-id'] ) || config.authorization['auth-client-id'];
		let authClientSecret = ( req.site && req.site.config.oauth['auth-client-secret'] ) || config.authorization['auth-client-secret'];
		let postData = {
			client_id: authClientId,
			client_secret: authClientSecret,
			code: code,
			grant_type: 'authorization_code'
		}

		fetch(
			url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				mode: 'cors',
				body: JSON.stringify(postData)
			})
			.then(
				response => {
					if (response.ok) return response.json()
					throw createError('Login niet gelukt');
				},
				error => {
					console.log('ERR');
				}
			)
			.then(
				json => {

					let accessToken = json.access_token;
					if (!accessToken) return next(createError(403, 'Inloggen niet gelukt: geen accessToken'));

					// todo: alleen in de sessie is wel heel simpel
					req.session.userAccessToken = accessToken;
					return next();
				}
			)
			.catch(err => {
				console.log('OAUTH DIGEST - FETCH TOKEN ERR');
				console.log(err);
				return next(err);
			});

	})
	.get(function( req, res, next ) {

		// get the user info using the access token
		let authServerUrl = ( req.site && req.site.config.oauth['auth-server-url'] ) || config.authorization['auth-server-url'];
		let authServerGetUserPath = ( req.site && req.site.config.oauth['auth-server-get-user-path'] ) || config.authorization['auth-server-get-user-path'];
		let authClientId = ( req.site && req.site.config.oauth['auth-client-id'] ) || config.authorization['auth-client-id'];
		let url = authServerUrl + authServerGetUserPath;
		url = url.replace(/\[\[clientId\]\]/, authClientId);

		fetch(
			url, {
				method: 'get',
				headers: {
					authorization : 'Bearer ' + req.session.userAccessToken,
				},
				mode: 'cors',
			})
			.then(
				response => response.json(),
				error => { return next(createError(403, 'User niet bekend')); }
			)
			.then(
				json => {
					req.userData = json;
					return next();
				}
			)
			.catch(err => {
				console.log('OAUTH DIGEST - GET USER ERROR');
				console.log(err);
				next(err);
			})

	})
	.get(function( req, res, next ) {

		let data = {
			externalUserId: req.userData.user_id,
			email: req.userData.email,
			firstName: req.userData.firstName,
			zipCode: req.userData.postcode,
			lastName: req.userData.lastName
		}

		let where = {
			where: Sequelize.or(
				{ externalUserId: req.userData.user_id },
				{ email: req.userData.email
				}
			)
		}
		
		// find or create the user
		db.User
			.findAll(where)
			.then(result => {
				if (result && result.length > 1) return next(createError(403, 'Meerdere users gevonden'));
				if (result && result.length == 1) {
					// user found; update and use
					let user = result[0];

					user.update(data);
					req.setSessionUser(user.id, '');
					req.userData.id = user.id;
					return next();
				} else {
					// user not found; create

					data.role = 'member';
					data.complete = true;
					db.User
						.create(data)
						.then(result => {
							console.log('USER CREATED', result.id);
							req.setSessionUser(result.id, '');
							req.userData.id = result.id;
							return next();
						})
						.catch(err => {
							console.log('OAUTH DIGEST - CREATE USER ERROR');
							console.log(err);
							next(err);
						})
				}
			})
			.catch(next)
	})
	.get(function( req, res, next ) {
		let authServerUrl = ( req.site && req.site.config.oauth['auth-server-url'] ) || config.authorization['auth-server-url'];

		/**
		 * @TODO; ADD DOMAIN CHECK!!!!!!!!
		 */
		let redirectUrl = req.session.returnTo ? req.session.returnTo + '?jwt=[[jwt]]' : false;
	  redirectUrl = redirectUrl || ( req.site && ( req.site.config.cms['after-login-redirect-uri'] || req.site.config.oauth['after-login-redirect-uri'] ) ) || config.authorization['after-login-redirect-uri'];
		redirectUrl = redirectUrl || '/';

		req.session.returnTo = '';

		req.session.save(() => {
			if (redirectUrl.match('[[jwt]]')) {
				jwt.sign({userId: req.userData.id}, config.authorization['jwt-secret'], { expiresIn: 182 * 24 * 60 * 60 }, (err, token) => {
					if (err) return next(err)
					req.redirectUrl = redirectUrl.replace('[[jwt]]', token);
					return next();
				});
			} else {
				req.redirectUrl = redirectUrl;
				return next();
			}
		});
	})
	.get(function( req, res, next ) {
		res.redirect(req.redirectUrl);
	})
	.get(function( req, res, next ) {
		res.redirect(req.redirectUrl);
	})

// uitloggen
// ---------
router
	.route('(/site/:siteId)?/logout')
	.get(function( req, res, next ) {

		req.session.destroy();

		let authServerUrl = ( req.site && req.site.config.oauth['auth-server-url'] ) || config.authorization['auth-server-url'];
		let authServerGetUserPath = ( req.site && req.site.config.oauth['auth-server-logout-path'] ) || config.authorization['auth-server-logout-path'];
		let authClientId = ( req.site && req.site.config.oauth['auth-client-id'] ) || config.authorization['auth-client-id'];
		let url = authServerUrl + authServerGetUserPath;
		url = url.replace(/\[\[clientId\]\]/, authClientId);

		res.redirect(url);

	});

// translate jwt to user data
// --------------------------
router
	.route('(/site/:siteId)?/me')
	.get(function( req, res, next ) {
		res.json(req.user)
	})

module.exports = router;
