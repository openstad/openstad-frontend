const Promise = require('bluebird');
const express = require('express');
const moment  = require('moment');
const db      = require('../../db');
const auth    = require('../../auth');

let router = express.Router({mergeParams: true});

// scopes: for all get requests
router
	.all('*', function(req, res, next) {

		req.scope = ['defaultScope', 'withIdea'];
		req.scope.push({method: ['forSiteId', req.params.siteId]});

		if (req.query.withVoteCount) {
			req.scope.push({method: ['withVoteCount', 'argument']});
		}

		if (req.query.withUserVote) {
			req.scope.push({method: ['withUserVote', 'argument', req.user.id]});
							
		}

		return next();

	})

router.route('/')

// list arguments
// --------------
	.get(auth.can('arguments:list'))
	.get(function(req, res, next) {

		let ideaId = parseInt(req.params.ideaId) || 0;
		let where = {};
		if (ideaId) {
			where.ideaId = ideaId;
		}
		let sentiment = req.query.sentiment;
		if (sentiment) {
			where.sentiment = sentiment;
		}

		db.Argument
			.scope(...req.scope)
			.findAll({ where })
			.then( found => {
				return found.map( entry => {
				  let can = {
						edit: req.user.can('arg:edit', entry.idea, entry),
						delete: req.user.can('arg:delete', entry.idea, entry),
					 	reply: req.user.can('arg:reply', entry.idea, entry),
					};
					entry = entry.toJSON();
					entry.can = can;
					entry.user = {
						nickName: entry.user.nickName || entry.user.fullName,
						isAdmin: entry.user.role == 'admin',
						email: req.user.role == 'admin' ? entry.user.email : '',
					};
					entry.createdAtText = moment(entry.createdAt).format('LLL');
					delete entry.idea;
					return entry;
				});
			})
			.then(function( found ) {
				res.json(found);
			})
			.catch(next);

	})

// create argument
// ---------------
	.post(auth.can('argument:create'))
	.post(function(req, res, next) {

		let data = {
			description : req.body.description,
			sentiment   : req.body.sentiment || 'for',
			label       : req.body.label,
			ideaId      : req.params.ideaId,
			userId      : req.user.id,
		}

		db.Argument
			.create(data)
			.then(result => {
				res.json(result);
			})
	})

	// with one existing argument
	// --------------------------
	router.route('/:argumentId(\\d+)')
		.all(function(req, res, next) {
			var argumentId = parseInt(req.params.argumentId) || 1;

			let ideaId = parseInt(req.params.ideaId) || 0;
			let sentiment = req.query.sentiment;
			let where = { ideaId, id: argumentId }
			
			if (sentiment) {
				where.sentiment = sentiment;
			}

			db.Argument
				.scope(...req.scope)
				.findOne({
					where
				})
				.then(entry => {
					if ( !entry ) throw new Error('Argument not found');
				  let can = {
						edit: req.user.can('arg:edit', entry.idea, entry),
						delete: req.user.can('arg:delete', entry.idea, entry),
					 	reply: req.user.can('arg:reply', entry.idea, entry),
					};
					entry = entry.toJSON();
					entry.can = can;
					entry.user = {
						nickName: entry.user.nickName || entry.user.fullName,
						isAdmin: entry.user.role == 'admin',
						email: req.user.role == 'admin' ? entry.user.email : '',
					};
					entry.createdAtText = moment(entry.createdAt).format('LLL');
					delete entry.idea;

					req.argument = entry;
					next();
				})
				.catch(next);
		})
	 
	// view argument
	// -------------
		.get(auth.can('argument:view'))
		.get(function(req, res, next) {
			res.json(req.argument);
		})
	 
	// update argument
	// ---------------
		.put(auth.can('argument:edit'))
		.put(function(req, res, next) {
			req.argument
				.update(req.body)
				.then(result => {
					res.json(result);
				})
				.catch(next);
		})
	 
	// delete argument
	// ---------------
		.delete(auth.can('argument:delete'))
		.delete(function(req, res, next) {
			req.argument
				.destroy()
				.then(() => {
					res.json({ "argument": "deleted" });
				})
				.catch(next);
		})

module.exports = router;
