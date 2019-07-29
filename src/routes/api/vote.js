const Promise     = require('bluebird');
const express     = require('express');
const createError = require('http-errors')
const moment      = require('moment');
const db          = require('../../db');
const auth        = require('../../auth');
const config      = require('config');
const merge       = require('merge');

let router = express.Router({mergeParams: true});

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
		if (!(req.site.config.votes.isViewable || req.user.role == 'admin')) {
			return next(createError(403, 'Stemmen zijn niet zichtbaar'));
		}
		return next();
	})

  // mag er gestemd worden
	.post(function(req, res, next) {
		let isActive = req.site.config.votes.isActive;
		if ( isActive == null && req.site.config.votes.isActiveFrom && req.site.config.votes.isActiveTo ) {
			isActive = moment().isAfter(req.site.config.votes.isActiveFrom) && moment().isBefore(req.site.config.votes.isActiveTo)
		}
		
		if (!isActive) {
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

// list all votes or all votes
// ---------------------------
router.route('/')
	.get(function(req, res, next) {
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
				res.json(found.map(entry => { return {
					id: entry.id,
					ideaId: entry.ideaId,
					userId: entry.userId,
					confirmed: entry.confirmed,
					opinion: entry.opinion,
				}}));
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
				if ( req.site.config.votes.withExisting == 'error' && found && found.length ) throw new Error('Je hebt al gestemd');
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

		let actions = [];
		switch(req.site.config.votes.voteType) {
			case 'likes':
				req.votes.forEach((vote) => {
					let existingVote = req.existingVotes.find(entry => entry.ideaId == vote.ideaId);
					if ( existingVote ) {
						if (existingVote.opinion == vote.opinion) {
							actions.push({ action: 'delete', vote: existingVote })
						} else {
							existingVote.opinion = vote.opinion
							actions.push({ action: 'update', vote: existingVote})
						}
					} else {
						actions.push({ action: 'create', vote: vote})
					}
				});
				break;

			case 'count':
				req.votes.map( vote => actions.push({ action: 'create', vote: vote}) );
				req.existingVotes.map( vote => actions.push({ action: 'delete', vote: vote}) );
				break;

			case 'budgeting':
				req.votes.map( vote => actions.push({ action: 'create', vote: vote}) );
				req.existingVotes.map( vote => actions.push({ action: 'delete', vote: vote}) );
				break;

		}

		Promise
			.map(actions, function(action) {
				switch(action.action) {
					case 'create':
						return db.Vote.create( action.vote ) // HACK: `upsert` on paranoid deleted row doesn't unset `deletedAt`.
						break;
					case 'update':
						return db.Vote.update(action.vote, { where: { id: action.vote.id } });
						break;
					case 'delete':
						return db.Vote.destroy({ where: { id: action.vote.id } });
						break;
				}
			}).then(
				result => {
					req.result = result;
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
				res.json(result.map(entry => { return {
					id: entry.id,
					ideaId: entry.ideaId,
					userId: entry.userId,
					confirmed: entry.confirmed,
					opinion: entry.opinion,
				}}));
			})
			.catch(next)
	})

module.exports = router;
