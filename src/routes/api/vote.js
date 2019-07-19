const Promise     = require('bluebird');
const express     = require('express');
const createError = require('http-errors')
const db          = require('../../db');
const auth        = require('../../auth');
const config      = require('config');
const merge       = require('merge');

let router = express.Router({mergeParams: true});

var defaultConfig = {
	"isActive": false,
	"votingType": "count",
	"maxIdeas": 5,
	"minIdeas": 4,
	"minBudget": 200000,
	"maxBudget": 300000,
};

// basis validaties
// ----------------
router.route('*')

  // bestaat de site config
	.all(function(req, res, next) {
		if (!( req.site && req.site.config && req.site.config.votes )) {
			return next(createError(403, 'Site niet gevonden of niet geconfigureerd'));
		}
		return next();
	})

  // mag je de stemmen bekijken
	.get(function(req, res, next) {
		if (!req.site.config.votes.isViewable) {
			return next(createError(403, 'Stemmen zijn niet zichtbaar'));
		}
		return next();
	})

  // mag er gestemd worden
	.post(function(req, res, next) {
		if (!req.site.config.votes.isActive) {
			return next(createError(403, 'Stemmen is gesloten'));
		}
		return next();
	})

  // is er een geldige gebruiker
	.all(function(req, res, next) {
		if (req.method == 'GET') return next(); // nvt
		if (!req.user) {
			return next(createError(401, 'Geen gebruiker gevonden'));
		}
		if (req.site.config.votes.requiredUserRole == 'anonymous') {
			return next(createError(401, 'Anonymous stemmen is nog niet geimplementeerd'));
		}
		if (req.site.config.votes.requiredUserRole == 'member' && req.user.role == 'member' || req.user.role == 'admin') {
			return next();
		}
		return next(createError(401, 'Je mag niet stemmen op deze site'));
	})

// list all votes or all votes for one idea
// ----------------------------------------
router.route('/')
	.get(function(req, res, next) {
		console.log(req.params);
		let where = {};
		let ideaId = req.query.ideaId;
		if (ideaId) {
			where.ideaId = ideaId;
		}
		let userId = req.query.userId;
		if (userId) {
			where.userId = userId;
		}
		let opinion = req.query.opinion;
		if (opinion) {
			where.opinion = opinion;
		}
		db.Vote
			.scope({ method: ['forSiteId', req.site.id]})
			.findAll({ where })
			.then(function( found ) {
				res.json(found);
			})
			.catch(next);
	});

// create votes
// ------------
router.route('/')

	// .post(auth.can('ideavote:create'))

  // heb je al gestemd
	.post(function(req, res, next) {
		db.Vote // get existing votes for this user
			.findAll({ where: { userId: req.user.id } })
			.then(found => {
				if ( req.site.config.votes.withExisting == 'error' && found ) throw new Error('Je hebt al gestemd');
				req.existingVotes = found.map(entry => entry.toJSON());
				return next();
			})
			.catch(next)
	})

  // filter body
	.post(function(req, res, next) {
		let votes = req.body || [];
		if (!Array.isArray(votes)) votes = [votes];
		votes = votes.map((entry) => {
			return {
				ideaId: parseInt(entry.ideaId),
				opinion: typeof entry.opinion == 'string' ? entry.opinion : null,
				userId: req.user.id,
				confirmed: false,
				confirmReplacesVoteId: null,
				ip: req.ip,
				checked: null,
			}
		});
		req.votes = votes;
		return next();
	})

  // validaties: bestaan de ideeen waar je op wilt stemmen
	.post(function(req, res, next) {
		let ids = req.votes.map( entry => entry.ideaId );
		db.Idea
			.findAll({ where: { id: ids, siteId: req.site.id } })
			.then(found => {
				if (req.votes.length != found.length) return next(createError(400, 'Idee niet gevonden'));
				req.ideas = found;
				return next();
			})
	})

  // validaties voor voteType=likes
	.post(function(req, res, next) {
		if (req.site.config.votes.voteType != 'likes') return next();
		return next();
	})

  // validaties voor voteType=count
	.post(function(req, res, next) {
		console.log('req.site.config.votes');
		if (req.site.config.votes.voteType != 'count') return next();
		if (req.votes.length >= req.site.config.votes.minIdeas && req.votes.length <= req.site.config.votes.maxIdeas) {
			return next();
		}
		return next(createError(400, 'Aantal ideeen klopt niet'));
	})

  // validaties voor voteType=budgeting
	.post(function(req, res, next) {
		if (req.site.config.votes.voteType != 'budgeting') return next();
		let budget = 0;
		req.votes.forEach((vote) => {
			let idea = req.ideas.find(idea => idea.id == vote.ideaId);
			budget += idea.budget;
		});
		if (budget >= req.site.config.votes.minBudget && budget <= req.site.config.votes.maxBudget) {
			return next();
		}
		return next(createError(400, 'Budget klopt niet'));
	})

	.post(function(req, res, next) {

		let toBeCreated = [];
		let toBeUpdated = [];
		let toBeDeleted = [];

		switch(req.site.config.votes.voteType) {

  		// dit is nog niet goed genoeg, omdat hij een niuew record niet maakt als daar al een deleted versie van is

			case 'likes':
				req.votes.forEach((vote) => {
					let existingVote = req.existingVotes.find(entry => entry.ideaId == vote.ideaId);
					if ( existingVote ) {
						if (existingVote.opinion == vote.opinion) {
							toBeDeleted.push(existingVote)
						} else {
							existingVote.opinion = vote.opinion
							toBeUpdated.push(existingVote)
							console.log(existingVote);
						}
					} else {
						toBeCreated.push(vote)
					}
				});
				break;

			case 'count':
				toBeCreated = req.votes;
				toBeUpdated = [];
				toBeDeleted = req.existingVotes;
				break;

			case 'budgeting':
				toBeCreated = req.votes;
				toBeUpdated = [];
				toBeDeleted = req.existingVotes;
				break;

		}

		// let vote = toBeCreated[0];
		// db.Vote
		//  	.upsert(vote)
		//  	.then(result => {
		//  		db.Vote.restore({where: {ideaId: vote.ideaId }})
		//  		console.log(result);
		//  		res.json(result)
		//  	})
		// return;

		// save
		let promises = [];
		toBeCreated.forEach((vote) => {
			let promise = db.Vote.restoreOrInsert( vote ) // HACK: `upsert` on paranoid deleted row doesn't unset `deletedAt`.
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
					console.log(result);
					req.result = {
						created: toBeCreated,
						updated: toBeUpdated,
						deleted: toBeDeleted,
					};
					return next();
				},
				error => next(error)
			)
			.catch(next)
	})

	.post(function(req, res, next) {
		let ideaIds = req.votes.map( entry => entry.ideaId );
		db.Vote // get existing votes for this user
			.findAll({ where: { userId: req.user.id, ideaId: ideaIds } })
			.then(found => {
				let result = found.map(entry => { return {
					id: entry.id,
					ideaId: entry.ideaId,
					opinion: entry.opinion,
					userId: entry.userId,
					confirmed: entry.confirmed,
					confirmReplacesVoteId: entry.confirmReplacesVoteId,
				}})
					res.json(result);
			})
			.catch(next)
	})

module.exports = router;
