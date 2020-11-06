const Sequelize 	= require('sequelize');
const express 		= require('express');
const createError = require('http-errors');
const fetch 			= require('isomorphic-fetch');
const jwt 				= require('jsonwebtoken');
const config 			= require('config');
const URL         = require('url').URL;
const db 					= require('../../db');

let router = express.Router({mergeParams: true});

/**
 * Check if redirectURI same host as registered
 */
const isAllowedRedirectDomain = (url, allowedDomains) => {
	let redirectUrlHost = '';
	try {
		redirectUrlHost = new URL(url).hostname;
	} catch(err) {}

	// throw error if allowedDomains is empty or the redirectURI's host is not present in the allowed domains
	return allowedDomains && allowedDomains.indexOf(redirectUrlHost) !== -1;
}

// inloggen 1
// ----------
router
	.route('(/site/:siteId)?/login')
	.get(function( req, res, next ) {

		if (req.query.forceNewLogin) {
      let baseUrl = config.url
			let backToHereUrl = baseUrl + '/oauth/site/' + req.site.id + '/login?' + ( req.query.useOauth ? 'useOauth=' + req.query.useOauth : '' ) + '&redirectUrl=' + req.query.redirectUrl
		  backToHereUrl = encodeURIComponent(backToHereUrl)
			let url = baseUrl + '/oauth/site/' + req.site.id + '/logout?redirectUrl=' + backToHereUrl;

			return res.redirect(url)
		}

		// Todo: Refactor this code, this logic also lives in the user middleware
		let which = req.query.useOauth || 'default';
		let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};;
		let authServerUrl = siteOauthConfig['auth-server-url'] || config.authorization['auth-server-url'];
		let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
		let authServerLoginPath = siteOauthConfig['auth-server-login-path'] || config.authorization['auth-server-login-path'];
		let authServerAdminLoginPath = siteOauthConfig['auth-server-admin-login-path'] || config.authorization['auth-server-admin-login-path'];

		authServerLoginPath = req.query.loginPriviliged ? authServerAdminLoginPath : authServerLoginPath;

		let url = authServerUrl + authServerLoginPath;
		url = url.replace(/\[\[clientId\]\]/, authClientId);
		//url = url.replace(/\[\[redirectUrl\]\]/, config.url + '/oauth/digest-login');
		url = url.replace(/\[\[redirectUrl\]\]/, encodeURIComponent(config.url + '/oauth/site/'+ req.site.id +'/digest-login?useOauth=' + which + '\&returnTo=' + req.query.redirectUrl));

		res.redirect(url);

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

		// Todo: Refactor this code, this logic also lives in the user middleware
		let which = req.query.useOauth || 'default';
		let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};;
		let authServerUrl = siteOauthConfig['auth-internal-server-url'] || config.authorization['auth-server-url'];
		let authServerExchangeCodePath = siteOauthConfig['auth-server-exchange-code-path'] || config.authorization['auth-server-exchange-code-path'];
		let url = authServerUrl + authServerExchangeCodePath;

		let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
		let authClientSecret = siteOauthConfig['auth-client-secret'] || config.authorization['auth-client-secret'];

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
					'Content-Type': 'application/json',
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
					console.log('ERR', error);
				}
			)
			.then(
				json => {

					let accessToken = json.access_token;
					if (!accessToken) return next(createError(403, 'Inloggen niet gelukt: geen accessToken'));

					// todo: alleen in de sessie is wel heel simpel
					req.userAccessToken = accessToken;
					return next();
				}
			)
			.catch(err => {
				console.log(err);
				return next(err);
			});

	})
	.get(function( req, res, next ) {

		// get the user info using the access token
		let which = req.query.useOauth || 'default';
		let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};;
		let authServerUrl = siteOauthConfig['auth-internal-server-url'] || config.authorization['auth-server-url'];
		let authServerGetUserPath = siteOauthConfig['auth-server-get-user-path'] || config.authorization['auth-server-get-user-path'];
		let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
		let url = authServerUrl + authServerGetUserPath;
		url = url.replace(/\[\[clientId\]\]/, authClientId);

		fetch(
			url, {
				method: 'get',
				headers: {
					authorization : 'Bearer ' + req.userAccessToken,
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
				//console.log('OAUTH DIGEST - GET USER ERROR');
				//console.log(err);
				next(err);
			})

	})
	.get(function( req, res, next ) {

		let data = {
			externalUserId: req.userData.user_id,
			externalAccessToken: req.userAccessToken,
			email: req.userData.email || null,
			firstName: req.userData.firstName,
			siteId: req.site.id,
			zipCode: req.userData.postcode ? req.userData.postcode : null,
			lastName: req.userData.lastName,
			// xxx
			role: req.userData.role || ( ( req.userData.email || req.userData.phoneNumber || req.userData.hashedPhoneNumber ) ? 'member' : 'anonymous' ),
		}

		// if user has same siteId and userId
		// rows are duplicate for a user
		let where = {
			where: Sequelize.and(
				{ externalUserId: req.userData.user_id },
				{ siteId: req.site.id },
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

					user
						.update(data)
						.then(() => {
							req.userData.id = user.id;
							return next();
						})
						.catch((e) => {
							console.log('update e', e)
							req.userData.id = user.id;
							return next();
						})

				} else {

					// user not found; create

					data.complete = true;

					db.User
						.create(data)
						.then(result => {
							req.userData.id = result.id;
							return next();
						})
						.catch(err => {
							//console.log('OAUTH DIGEST - CREATE USER ERROR');
							console.log('create e', err);
							next(err);
						})
				}
			})
			.catch(next)
	})
	.get(function( req, res, next ) {
		let which = req.query.useOauth || 'default';
		let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};;
		let authServerUrl = siteOauthConfig['auth-server-url'] || config.authorization['auth-server-url'];

    let returnTo = req.query.returnTo;
		let redirectUrl = returnTo ? returnTo + (returnTo.includes('?') ? '&' : '?') + 'jwt=[[jwt]]' : false;
		redirectUrl = redirectUrl || ( req.query.returnTo ? req.query.returnTo  + (req.query.returnTo.includes('?') ? '&' : '?') +  'jwt=[[jwt]]' : false );
	  redirectUrl = redirectUrl || ( req.site && req.site.config && req.site.config.cms['after-login-redirect-uri'] ) || siteOauthConfig['after-login-redirect-uri'] || config.authorization['after-login-redirect-uri'];
		redirectUrl = redirectUrl || '/';

		//check if redirect domain is allowed
		if (isAllowedRedirectDomain(redirectUrl, req.site && req.site.config && req.site.config.allowedDomains)) {
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
		} else {
			res.status(500).json({
				status: 'Redirect domain not allowed'
			});
		}

	})
	.get(function( req, res, next ) {
		res.redirect(req.redirectUrl);
	});

// uitloggen
// ---------
router
	.route('(/site/:siteId)?/logout')
	.get(function( req, res, next ) {

		if (req.user && req.user.id > 1) {
			req.user.update({
				externalAccessToken: null
			});
		}

		let which = req.query.useOauth || 'default';
		let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};;

		let authServerUrl = siteOauthConfig['auth-server-url'] || config.authorization['auth-server-url'];
		let authServerGetUserPath = siteOauthConfig['auth-server-logout-path'] || config.authorization['auth-server-logout-path'];
		let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
		let url = authServerUrl + authServerGetUserPath;

		url = url.replace(/\[\[clientId\]\]/, authClientId);

		if (req.query.redirectUrl) {
			url = `${url}&redirectUrl=${encodeURIComponent(req.query.redirectUrl)}`;
		}

		res.redirect(url);
	});

// translate jwt to user data
// --------------------------
router
	.route('(/site/:siteId)?/me')
	.get(function( req, res, next ) {
		const data = {
			"id": req.user.id,
			"complete": req.user.complete,
			"externalUserId": req.user.role == 'admin' ? req.user.externalUserId : null,
			"role": req.user.role,
			"email": req.user.email,
			"firstName": req.user.firstName,
			"lastName": req.user.lastName,
			"fullName": req.user.fullName,
			"nickName": req.user.nickName,
			"initials": req.user.initials,
			"gender": req.user.gender,
			"extraData": req.user.extraData ?  req.user.extraData : {},
			"phoneNumber": req.user.phoneNumber,
			"streetName": req.user.streetName,
			"city": req.user.city,
			"houseNumber": req.user.houseNumber,
			"suffix": req.user.suffix,
			"postcode": req.user.postcode,
			"zipCode": req.user.zipCode,
			"signedUpForNewsletter": req.user.signedUpForNewsletter,
			"createdAt": req.user.createdAt,
			"updatedAt": req.user.updatedAt,
			"deletedAt": req.user.deletedAt,
		};

		res.json(data);
	})

module.exports = router;
