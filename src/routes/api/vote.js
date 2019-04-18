const Promise     = require('bluebird');
const express     = require('express');
const createError = require('http-errors')
const db          = require('../../db');
const auth        = require('../../auth');
const config      = require('config');
const merge       = require('merge');

let router = express.Router({mergeParams: true});

router.route('(/idea/:ideaId(\\d+))?/vote')

// get idea, for all get requests
	.all(function(req, res, next) {
		var ideaId = parseInt(req.params.ideaId);
		if (!ideaId) return next();
		db.Idea
			.scope('api')
			.findByPk(ideaId)
			.then(function( idea ) {
				if( !idea ) {
					return next(createError(404, 'Idee niet gevonden'));
				} else {
					req.idea = idea;
					return next();
				}
			})
			.catch(next);
	})

// list votes
// --------------
	.get(auth.can('ideavotes:list'))
	.get(function(req, res, next) {

		let ideaId = req.idea && req.idea.id;
		let where = ideaId ? { where: { ideaId } } : {};
		req.scope = ['defaultScope'];
		let opinion = req.query.opinion;
		if (opinion) {
			where.opinion = opinion;
		}
		db.Vote
			.scope(...req.scope)
			.findAll(where)
			.then( found => {
				return found.map( entry => entry.toJSON() );
			})
			.then(function( found ) {
				res.json(found);
			})
			.catch(next);

	})

// check user
// ----------
	// .post(function(req, res, next) {
	//  
	//  	if (req.site.config.votes.userRole != 'anonymous') {
	//  		return next();
	//  	}			
	//  
	//  	if (req.user.id != 1) { // ToDo: blijkbaar krijgen anonieme requests deze gebruiker mee....
	//  		return next();
	//  	}			
	//  		
	//  	console.log('CREATE USER');
	//  	// anonymous is allowed and a user does not yet exist; create one
	//  	let zipCode = req.body.zipCode;
	//  	if (!zipCode) {
	//  		zipCode = '1234 EF'
	//  		// return next(createError(403, 'Bij anoniem stemmen is een postcode verplicht'));
	//  	}
	//  	db.User.registerAnonymous(zipCode)
	//  		.then(function( newUser ) {
	//  			req.setSessionUser(newUser.id);
	//  			req.user = newUser;
	//  			return next();
	//  		})
	//  		.catch(function( error ) {
	//  			return next(error);
	//  		});
	//  
	// })

// add vote
// --------
// todo: confirmed
// todo: validate
// todo: userRole
	.post(auth.can('ideavote:create'))
	.post(function(req, res, next) {
		return next();
	})
	.post(function(req, res, next) {
		// todo: dit moet voor alles, en dus op een generiekere plek
		req.voteConfig = {
			maxChoices: null,
			widthExisting: 'replace',
			mustConfirm: false,
			userRole: 'anonymous'
		}
		var config1 = config.vote;
		var config2 = req.site && req.site.config && req.site.config.votes;
		if (config1) req.voteConfig = merge (req.voteConfig, config1);
		if (config2) req.voteConfig = merge (req.voteConfig, config2);
		return next();
	})

// en de rest moet naar het model
	.post(function(req, res, next) {

		// get existing votes for this user
		db.Vote
			.findAll({ where: { userId: req.user.id } })
			.then(found => {
				if ( req.voteConfig.widthExisting == 'error' && found ) throw new Error('Je hebt al gestemd');
				return found || [];
			})
			.then(existingVotes => {

				var result = {};
				
				let newVotes = Array.isArray(req.body) ? req.body : [req.body];

				// zet ideaId en ip
				if (req.params.ideaId) {
					newVotes.forEach((newVote) => {
						newVote.ideaId = req.params.ideaId;
					});
				}
				
				let toBeCreated = [];
				let toBeUpdated = [];
				let toBeDeleted = [];

				newVotes.forEach((vote, index) => {
					// todo: validate
				});

				newVotes.forEach((newVote, index) => {
					let existingVote = existingVotes.find( existingVote => existingVote.userId == req.user.id && existingVote.ideaId == newVote.ideaId );

					if ( existingVote && ( req.voteConfig.widthExisting == 'replace' || req.voteConfig.widthExisting == 'replaceAll' ) ) {
						toBeUpdated.push({
							id: existingVote.id,
							ideaId: newVote.ideaId,
							userId: req.user.id,
							opinion: newVote.opinion,
							ip: req.ip,
						});
					}

					if ( existingVote && req.voteConfig.widthExisting == 'createOrCancel' ) {
						toBeDeleted.push({
							id: existingVote.id,
						});
					}

					if (!existingVote) {
						toBeCreated.push({
							ideaId: newVote.ideaId,
							userId: req.user.id,
							opinion: newVote.opinion,
							ip: req.ip,
						})
					}

				});

				if (req.voteConfig.widthExisting == 'replaceAll') {
					Array.prototype.forEach.call(existingVotes, (existingVote) => {
						let newVote = newVotes.find( newVote => newVote.ideaId == existingVote.ideaId );
						if (!newVote) {
							toBeDeleted.push({
								id: existingVote.id,
							});
						}
					});
				}

				// save
				let promises = [];
				toBeCreated.forEach((vote) => {
					vote.deleteAt = null;
					let promise = db.Vote.upsert( vote ) // HACK: `upsert` on paranoid deleted row doesn't unset `deletedAt`.
					promises.push( promise )
				});
				toBeUpdated.forEach((vote) => {
					let promise = db.Vote.update(vote, { where: { id: vote.id } });
					promises.push( promise )
				});
				toBeDeleted.forEach((vote) => {
					let promise = db.Vote.destroy({ where: { id: vote.id } });
					promises.push( promise )
				});

				Promise
					.all(promises)
					.then(
						result => {

							req.result = {
								created: toBeCreated,
								updated: toBeUpdated,
								deleted: toBeDeleted,
							};
							
							return next();
						},
						error => next(error)
					)

			})
			.catch(next)

	})
	.post(function(req, res, next) {
		next();
	})
	.post(function(req, res, next) {
		let data = {
			result  : req.result,
		}
		res.json(data)		
	})

module.exports = router;
