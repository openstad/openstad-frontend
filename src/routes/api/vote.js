const Promise     = require('bluebird');
const express     = require('express');
const createError = require('http-errors')
const db          = require('../../db');
const auth        = require('../../middleware/sequelize-authorization-middleware');
const config      = require('config');
const merge       = require('merge');
const bruteForce = require('../../middleware/brute-force');
const {Op} = require('sequelize');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results-static');

const router = express.Router({mergeParams: true});

const userhasModeratorRights = (user) => {
	return user && (user.role === 'admin' || user.role === 'editor' || user.role === 'moderator');
}

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

router.route('*')

  // mag er gestemd worden
	.post(function(req, res, next) {
		if (!req.site.isVoteActive()) return next(createError(403, 'Stemmen is gesloten'));
		return next();
	})

  // is er een geldige gebruiker
	.all(function(req, res, next) {
		if (req.method == 'GET') return next(); // nvt

		let hasModeratorRights = (req.user.role === 'admin' || req.user.role === 'editor' || req.user.role === 'moderator');

		if (!req.user) {
			return next(createError(401, 'Geen gebruiker gevonden'));
		}

		if (req.site.config.votes.requiredUserRole == 'anonymous' && ( req.user.role == 'anonymous' || req.user.role == 'member' || hasModeratorRights )) {
			return next();
		}

		if (req.site.config.votes.requiredUserRole == 'member' && ( req.user.role == 'member' || hasModeratorRights )) {
			return next();
		}

		if (req.site.config.votes.requiredUserRole == 'admin' && ( hasModeratorRights )) {
			return next();
		}

		return next(createError(401, 'Je mag niet stemmen op deze site'));
	})

  // scopes
	.all(function(req, res, next) {

		req.scope = [
			{ method: ['forSiteId', req.site.id]}
    ];

    return next();

  })

// list all votes or all votes
// ---------------------------
router.route('/')

// mag je de stemmen bekijken
	.get(function(req, res, next) {
		let hasModeratorRights = (req.user.role === 'admin' || req.user.role === 'editor' || req.user.role === 'moderator');

		if (!(req.site.config.votes.isViewable || hasModeratorRights)) {
			return next(createError(403, 'Stemmen zijn niet zichtbaar'));
		}
		return next();
	})
	.get(pagination.init)
	.get(function(req, res, next) {
		let { dbQuery } = req;

		let where = {...dbQuery.where};
		let ideaId = parseInt(req.query.ideaId);
		if (ideaId) {
			where.ideaId = ideaId;
		}
		let userId = parseInt(req.query.userId);
		if (userId) {
			where.userId = userId;
		}
		let opinion = req.query.opinion;

		if (opinion && (opinion == 'yes' || opinion == 'no')) {
			where.opinion = opinion;
		}

		/**
		 * In case of no opinion, it's a bug with the likes, dont send them
		 * @TODO debug in what case this happens.
		 */
		if (req.site.config.votes.voteType === 'likes') {
			where.opinion =  {
      	[Op.ne]: null
    	};
		}

    const order = [];
    if (req.query.sortBy) {
      order.push([
        req.query.sortBy,
        req.query.orderBy || 'ASC'
      ])
    }

		if (req.user && userhasModeratorRights(req.user)) {
			req.scope.push('includeUser');
		}

		db.Vote
			.scope(req.scope)
			.findAndCountAll({ where, order, ...dbQuery })
			.then(function( result ) {
        req.results = result.rows;
        req.dbQuery.count = result.count;
        return next();
			})
			.catch(next);
	})
	.get(searchResults)
	.get(pagination.paginateResults)
	.get(function(req, res, next) {
    let records = req.results.records || req.results
		records.forEach((entry, i) => {
			let vote = {
				id: entry.id,
				ideaId: entry.ideaId,
				userId: entry.userId,
				confirmed: entry.confirmed,
				opinion: entry.opinion,
				createdAt: entry.createdAt
			};

			if (req.user && userhasModeratorRights(req.user)) {
				vote.ip = entry.ip;
				vote.createdAt = entry.createdAt;
				vote.checked =  entry.checked;
				vote.user = entry.user;
			}
      records[i] = vote
		});
		res.json(req.results);
  });

// create votes
// ------------
router.route('/*')

// heb je al gestemd
	.post(function(req, res, next) {
		db.Vote // get existing votes for this user
			.scope(req.scope)
			.findAll({ where: { userId: req.user.id } })
			.then(found => {
				if (req.site.config.votes.voteType !== 'likes' && req.site.config.votes.withExisting == 'error' && found && found.length ) throw createError(403, 'Je hebt al gestemd');
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
				ideaId: parseInt(entry.ideaId, 10),
				opinion: typeof entry.opinion == 'string' ? entry.opinion : null,
				userId: req.user.id,
				confirmed: false,
				confirmReplacesVoteId: null,
				ip: req.ip,
				checked: null,
			}
		});

    // merge
    if (req.site.config.votes.withExisting == 'merge') {
      // no double votes
      try {
        if (req.existingVotes.find( newVote => votes.find( oldVote => oldVote.ideaId == newVote.ideaId) )) throw createError(403, 'Je hebt al gestemd');
      } catch (err) {
        return next(err);
      }
      // now merge
      votes = votes
        .concat(
          req.existingVotes
            .map( oldVote => {
              return {
                ideaId: parseInt(oldVote.ideaId, 10),
                opinion: typeof oldVote.opinion == 'string' ? oldVote.opinion : null,
                userId: req.user.id,
                confirmed: false,
                confirmReplacesVoteId: null,
                ip: req.ip,
                checked: null,
              }
              return oldVote
            })
        );
    }

    req.votes = votes;

		return next();
	})

  // validaties: bestaan de ideeen waar je op wilt stemmen
	.post(function(req, res, next) {
		let ids = req.votes.map( entry => entry.ideaId );
		db.Idea
			.findAll({ where: { id:ids, siteId: req.site.id } })
			.then(found => {

				if (req.votes.length != found.length) {
					console.log('req.votes', req.votes);
					console.log('found', found);
					console.log('req.body',req.body);

					return next(createError(400, 'Idee niet gevonden'));
				}
				req.ideas = found;
				return next();
			})
	})

  // validaties voor voteType=likes
	.post(function(req, res, next) {
		if (req.site.config.votes.voteType != 'likes') return next();

		if (req.site.config.votes.voteType == 'likes' && req.site.config.votes.requiredUserRole == 'anonymous') {
			req.votes.forEach((vote) => {
				// check if votes exists for same opinion on the same IP within 5 minutes
				const whereClause = {
						ip: vote.ip,
			//			opinion : vote.opinion,
						ideaId: vote.ideaId,
						createdAt: {
							[Op.gte]: db.sequelize.literal('NOW() - INTERVAL 5 MINUTE'),
						}
				};

				// Make sure it only blocks new users
				// otherwise the toggle functionality for liking is blocked
				if (req.user) {
					whereClause.userId = {
						[Op.ne] : req.user.id
					};
				}

				// get existing votes for this IP
				db.Vote
					.findAll({ where: whereClause })
					.then(found => {
						if (found && found.length > 0) {
							throw createError(403, 'Je hebt al gestemd');
						}
						return next();
					})
					.catch(next)
			});
		} else {
			return next();
		}
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
		if (!( budget >= req.site.config.votes.minBudget && budget <= req.site.config.votes.maxBudget )) {
		  return next(createError(400, 'Budget klopt niet'));
		}
		if (!( req.votes.length >= req.site.config.votes.minIdeas && req.votes.length <= req.site.config.votes.maxIdeas )) {
		  return next(createError(400, 'Aantal ideeen klopt niet'));
		}
		return next();
  })

  // validaties voor voteType=count-per-theme
	.post(function(req, res, next) {
		if (req.site.config.votes.voteType != 'count-per-theme') return next();

    let themes = req.site.config.votes.themes || [];

    let totalNoOfVotes = 0;
    req.votes.forEach((vote) => {
			let idea = req.ideas.find(idea => idea.id == vote.ideaId);
      totalNoOfVotes += idea ? 1 : 0;
      let themename = idea && idea.extraData && idea.extraData.theme;
      let theme = themes.find( theme => theme.value == themename );
      if (theme) {
	      theme.noOf = theme.noOf || 0;
        theme.noOf++;
      }
		});

    let isOk = true;
    themes.forEach((theme) => {
	    theme.noOf = theme.noOf || 0;
		  if (theme.noOf < theme.minIdeas || theme.noOf > theme.maxIdeas) {
        isOk = false;
		  }
    });

		if (( req.site.config.votes.minIdeas && totalNoOfVotes < req.site.config.votes.minIdeas ) || ( req.site.config.votes.maxIdeas && totalNoOfVotes > req.site.config.votes.maxIdeas )) {
      isOk = false;
		}

		return next( isOk ? null : createError(400, 'Count per thema klopt niet') );

	})

  // validaties voor voteType=budgeting-per-theme
	.post(function(req, res, next) {
		if (req.site.config.votes.voteType != 'budgeting-per-theme') return next();
    let themes = req.site.config.votes.themes || [];
		req.votes.forEach((vote) => {
			let idea = req.ideas.find(idea => idea.id == vote.ideaId);
      let themename = idea && idea.extraData && idea.extraData.theme;
      let theme = themes.find( theme => theme.value == themename );
      if (theme) {
	      theme.budget = theme.budget || 0;
        theme.budget += idea.budget;
      }
		});
    let isOk = true;
    themes.forEach((theme) => {
		  if (theme.budget < theme.minBudget || theme.budget > theme.maxBudget) {
        isOk = false;
		  }
  //    console.log(theme.value, theme.budget, theme.minBudget, theme.maxBudget, theme.budget < theme.minBudget || theme.budget > theme.maxBudget);
    });
		return next( isOk ? null : createError(400, 'Budget klopt niet') );
	})

	.post(function(req, res, next) {

		let actions = [];
		switch(req.site.config.votes.voteType) {

			case 'likes':
				req.votes.forEach((vote) => {
					let existingVote =  req.existingVotes ? req.existingVotes.find(entry => entry.ideaId == vote.ideaId) : false;
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
			case 'count-per-theme':
			case 'budgeting':
			case 'budgeting-per-theme':
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

	router.route('/:voteId(\\d+)')
		.all(( req, res, next ) => {
			var voteId = req.params.voteId;

			db.Vote
			.findOne({
				where: { id: voteId }
			})
			.then(function( vote ) {
				if( vote ) {
					req.results = vote;
				}
				next();
			})
			.catch(next);
		})
	.delete(auth.useReqUser)
	.delete(function(req, res, next) {
		const vote = req.results;
		if (!( vote && vote.can && vote.can('delete') )) return next( new Error('You cannot delete this vote') );

		vote
			.destroy()
			.then(() => {
				res.json({ "vote": "deleted" });
			})
			.catch(next);
	})

	router.route('/:voteId(\\d+)/toggle')
		.all(( req, res, next ) => {
			var voteId = req.params.voteId;

			db.Vote
			.findOne({
				where: { id: voteId }
			})
			.then(function( vote ) {
				if( vote ) {
					req.vote = vote;
				}
				next();
			})
			.catch(next);
		})
	.all(auth.can('Vote', 'toggle'))
			.get(function( req, res, next ) {
				var ideaId = req.params.ideaId;
				var vote   = req.vote;

				vote.toggle()
					.then(function() {
						res.json({
							id: vote.id,
							ideaId: vote.ideaId,
							userId: vote.userId,
							confirmed: vote.confirmed,
							opinion: vote.opinion,
							ip: vote.ip,
						  createdAt: vote.createdAt,
							checked: vote.checked
						});
					})
					.catch(next);
			});


module.exports = router;
