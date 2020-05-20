const Promise = require('bluebird');
const Sequelize = require('sequelize');
const express = require('express');
const moment			= require('moment');
const createError = require('http-errors')
const config = require('config');
const db = require('../../db');
const auth = require('../../auth');
const mail = require('../../lib/mail');
const pagination = require('../../middleware/pagination');


let router = express.Router({mergeParams: true});

const userhasModeratorRights = (user) => {
	return user && (user.role === 'admin' || user.role === 'editor' || user.role === 'moderator');
}

// scopes: for all get requests
/*
router
	.all('*', function(req, res, next) {
		next();
	})
*/

router.route('/')

// list users
// ----------
	.get(auth.can('users:list'))
	.get(pagination.init)
	.get(function(req, res, next) {
		let queryConditions = req.queryConditions ? req.queryConditions : {};
		queryConditions = Object.assign(queryConditions, { siteId: req.params.siteId });

		db.User
			//.scope(...req.scope)
		//	.scope()
		//	.findAll()
			.findAndCountAll({
				where:queryConditions,
				 offset: req.pagination.offset,
				 limit: req.pagination.limit
			})
			.then(function( result ) {
				req.results = result.rows;
				req.pagination.count = result.count;
				return next();
			})
			.catch(next);
	})
//	.get(searchResults)
	.get(pagination.paginateResults)
	.get(function(req, res, next) {
		let records = req.results.records || req.results
		records.forEach((record, i) => {
			records[i] = createUserJSON(record, req.user, req);
		});
		res.json(req.results);
	})

// create user
// -----------
	.post(auth.can('user:create'))
	.post(function(req, res, next) {
		if (!req.site) return next(createError(401, 'Site niet gevonden'));
		return next();
	})
	.post(function( req, res, next ) {
		if (!(req.site.config && req.site.config.users && req.site.config.users.canCreateNewUsers)) return next(createError(401, 'Gebruikers mogen niet aangemaakt worden'));
		return next();
	})
	.post(function(req, res, next) {
		filterBody(req);
		req.body.siteId = parseInt(req.params.siteId);

		db.User
			.create(req.body)
			.then(result => {
				res.json(createUserJSON(result, req.user, req));
			})
			.catch(function( error ) {
				// todo: dit komt uit de oude routes; maak het generieker
				if( typeof error == 'object' && error instanceof Sequelize.ValidationError ) {
					let errors = [];
					error.errors.forEach(function( error ) {
						errors.push(error.message);
					});
					res.status(422).json(errors);
				} else {
					next(error);
				}
			});
	})

// one user
// --------
router.route('/:userId(\\d+)')
	.all(function(req, res, next) {
		const userId = parseInt(req.params.userId) || 1;

		console.log('userId', userId)

		db.User
			.findOne({
					where: { id: userId, siteId: req.params.siteId }
					//where: { id: userId }
			})
			.then(found => {
				if ( !found ) throw new Error('User not found');
				req.userData = found;
				next();
			})
			.catch(next);
	})

// view idea
// ---------
	.get(auth.can('user:view'))
	.get(function(req, res, next) {
		res.json(createUserJSON(req.userData, req.user, req));
	})

// update user
// -----------
	.put(auth.can('user:edit'))
	.put(function(req, res, next) {
		filterBody(req)
		const userId = parseInt(req.params.userId) || 1;

		/**
		 * Update the user API first
		 */
		 let which = req.query.useOauth || 'default';
		 let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};
		 let authServerUrl = siteOauthConfig['auth-server-url'] || config.authorization['auth-server-url'];
		 let authUpdateUrl = authServerUrl + '/api/admin/user/' + req.userData.externalUserId;
		 let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
		 let authClientSecret = siteOauthConfig['auth-client-secret'] || config.authorization['auth-client-secret'];

		 const apiCredentials = {
			 client_id: authClientId,
			 client_secret: authClientSecret,
		 }

		 fetch(
			 authUpdateUrl, {
				 method: 'post',
				 headers: {
					 'Content-Type': 'application/json',
				 },
				 mode: 'cors',
				 body: JSON.stringify(Object.assign(apiCredentials, req.body))
			 })
			 .then((response) => {
					 if (response.ok) {
						 return response.json()
					 }

					 throw createError('Updaten niet gelukt', response);
				})
			 .then((json) => {
				 //update values from API
				 	return db.User.update(req.body, {where : { externalUserId: json.id }});
			  })
				.then( (result) => {
					return db.User
						.findOne({
					 			where: { id: userId, siteId: req.params.siteId }
								//where: { id: parseInt(req.params.userId) }
						})
				})
				.then(found => {
					if ( !found ) throw new Error('User not found');
					req.userData = found;
					res.json(createUserJSON(found, req.user, req));
				})
			 .catch(err => {
				 console.log(err);
				 return next(err);
			 });
	})

// delete idea
// ---------
	.delete(auth.can('user:delete'))
	.delete(function(req, res, next) {
		req.userData
			.destroy()
			.then(() => {
				res.json({ "idea": "deleted" });
			})
			.catch(next);
	})

// extra functions
// ---------------

function filterBody(req) {
	let filteredBody = {};
	let keys = [ 'firstName', 'lastName', 'email', 'phoneNumber', 'streetName', 'houseNumber', 'city', 'suffix', 'postcode'];

	if (userhasModeratorRights(req.user)) {
		//keys.push
	}

	keys.forEach((key) => {
		if (req.body[key]) {
			filteredBody[key] = req.body[key];
		}
	});

	req.body = filteredBody;
}

function createUserJSON(userData, user, req) {
	let hasModeratorRights = user &&(user.role === 'admin' || user.role === 'editor' || user.role === 'moderator');

	let can = {
		// edit: user.can('arg:edit', argument.idea, argument),
		// delete: req.user.can('arg:delete', entry.idea, entry),
		// reply: req.user.can('arg:reply', entry.idea, entry),
	};

	let result = userData.toJSON();
	result.config = null;
	result.site = null;
	result.can = can;

	return result;
}

module.exports = router;
