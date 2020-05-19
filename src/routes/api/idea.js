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
const searchResults = require('../../middleware/search-results');

let router = express.Router({mergeParams: true});

// scopes: for all get requests
router
	.all('*', function(req, res, next) {

		req.scope = ['api'];

		var sort = (req.query.sort || '').replace(/[^a-z_]+/i, '') || (req.cookies['idea_sort'] && req.cookies['idea_sort'].replace(/[^a-z_]+/i, ''));
		if (sort) {
			//res.cookie('idea_sort', sort, { expires: 0 });

			if (sort == 'votes_desc' || sort == 'votes_asc') {
				req.scope.push('includeVoteCount'); // het werkt niet als je dat in de sort scope functie doet...
			}
			req.scope.push({ method: ['sort', req.query.sort]});
		}

		if (req.query.mapMarkers) {
			req.scope.push('mapMarkers');
		}

		if (req.query.filters) {
			req.scope.push({ method: ['filter', req.query.filters]});
		}

		if (req.query.running) {
			req.scope.push('selectRunning');
		}

		if (req.query.includeArguments) {
			req.scope.push({ method: ['includeArguments', req.user.id]});
		}

		if (req.query.includeTags) {
			req.scope.push('includeTags');
		}

		if (req.query.tags) {
      let tags = req.query.tags;
			req.scope.push({ method: ['selectTags', tags]});
			req.scope.push('includeTags');
		}

		if (req.query.includeMeeting) {
			req.scope.push('includeMeeting');
		}

		if (req.query.includePosterImage) {
			req.scope.push('includePosterImage');
		}

		if (req.query.includeUser) {
			req.scope.push('includeUser');
		}

		// in case the votes are archived don't use these queries
		// this means they can be cleaned up from the main table for performance reason
		if (!req.site.config.archivedVotes) {
			if (req.query.includeVoteCount && req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable) {
				req.scope.push('includeVoteCount');
			}

			if (req.query.includeUserVote && req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable) {
				// ik denk dat je daar niet het hele object wilt?
				req.scope.push({ method: ['includeUserVote', req.user.id]});
			}
		}

		// todo? volgens mij wordt dit niet meer gebruikt
		// if (req.query.highlighted) {
		//  	query = db.Idea.getHighlighted({ siteId: req.params.siteId })
		// }

		return next();

	})

router.route('/')

// list ideas
// ----------
	.get(auth.can('ideas:list'))
	.get(pagination.init)
	// add filters
	.get(function(req, res, next) {

		let queryConditions = req.queryConditions ? req.queryConditions : {};
		queryConditions = Object.assign(queryConditions, { siteId: req.params.siteId });

		db.Idea
			.scope(...req.scope)
			.findAndCountAll({ where: queryConditions, offset: req.pagination.offset, limit: req.pagination.limit })
			.then(function( result ) {
        req.results = result.rows;
        req.pagination.count = result.count;
        return next();
			})
			.catch(next);
	})
	.get(searchResults)
	.get(pagination.paginateResults)
	.get(function(req, res, next) {
    let records = req.results.records || req.results
		records.forEach((record, i) => {
      records[i] = createIdeaJSON(record, req.user, req);
		});
		res.json(req.results);
  })

// create idea
// -----------
	.post(auth.can('idea:create'))
	.post(function(req, res, next) {
		if (!req.site) return next(createError(401, 'Site niet gevonden'));
		return next();
	})
	.post(function( req, res, next ) {
		if (!(req.site.config && req.site.config.ideas && req.site.config.ideas.canAddNewIdeas)) return next(createError(401, 'Inzenden is gesloten'));
		return next();
	})
	.post(function(req, res, next) {
		filterBody(req);
		req.body.siteId = parseInt(req.params.siteId);
		req.body.userId = req.user.id;
		req.body.startDate = new Date();

		try {
			req.body.location = JSON.parse(req.body.location || null);
		} catch(err) {}

    let responseData;
		db.Idea
			.create(req.body)
			.then(ideaInstance => {
				responseData = createIdeaJSON(ideaInstance, req.user, req);
        return ideaInstance;
			})
			.then(ideaInstance => {
        // tags
        console.log('req.body.tags 2', req.body.tags, req.body);


        if (!req.body.tags) {
					return ideaInstance;
				}

				const tags = req.body.tags ? req.body.tags.map(tagId => parseInt(tagId)) : [];
				console.log('tagstags', tags);

		      return ideaInstance
		        .setTags(tags)
		        .then(() => {
		          return ideaInstance;
		        })
				    .then(ideaInstance => {
		          // refetch. now with tags
		          let scope = [...req.scope, 'includeVoteCount', 'includeTags']

							console.log('ideaInstance', ideaInstance);

			        return db.Idea
				        .scope(...scope)
				        .findOne({
					        where: { id: ideaInstance.id, siteId: req.params.siteId }
				        })
				        .then(found => {
									console.log('found', found.id);

					        if ( !found ) throw new Error('Idea not found');
					        responseData = createIdeaJSON(found, req.user, req);
		              return found;
				        })
				        .catch((e) => {
									console.log('erererer', e);
									next();
								});
		        })
			})
			.then(ideaInstance => {
				res.json(responseData);
				mail.sendThankYouMail(ideaInstance, req.user, req.site) // todo: optional met config?
			})
			.catch(function( error ) {
				// todo: dit komt uit de oude routes; maak het generieker
				if( typeof error == 'object' && error instanceof Sequelize.ValidationError ) {
					let errors = [];
					error.errors.forEach(function( error ) {
						// notNull kent geen custom messages in deze versie van sequelize; zie https://github.com/sequelize/sequelize/issues/1500
						// TODO: we zitten op een nieuwe versie van seq; vermoedelijk kan dit nu wel
						errors.push(error.type === 'notNull Violation' && error.path === 'location' ? 'Kies een locatie op de kaart' : error.message);
					});
					res.status(422).json(errors);
				} else {
					next(error);
				}
			});
	})

// one idea
// --------
router.route('/:ideaId(\\d+)')
	.all(function(req, res, next) {
		var ideaId = parseInt(req.params.ideaId) || 1;

		db.Idea
			.scope(...req.scope, 'includeVoteCount')
			.findOne({
				where: { id: ideaId, siteId: req.params.siteId }
			})
			.then(found => {
				if ( !found ) throw new Error('Idea not found');
				req.idea = found;
				next();
			})
			.catch(next);
	})

// view idea
// ---------
	.get(auth.can('idea:view'))
	.get(function(req, res, next) {
		res.json(createIdeaJSON(req.idea, req.user, req));
	})

// update idea
// -----------
	.put(auth.can('idea:edit'))
	.put(function(req, res, next) {
		filterBody(req)
		if (req.body.location) {
			try {
				req.body.location = JSON.parse(req.body.location || null);
			} catch(err) {}
		} else {
			req.body.location = JSON.parse(null);
		}

    let responseData;
		req.idea
			.update(req.body)
			.then(ideaInstance => {
				responseData = createIdeaJSON(ideaInstance, req.user, req);
        return ideaInstance;
			})
			.then(ideaInstance => {
        // tags
        if (!req.body.tags) return;
        let tagIds = [];
        return db.Tag
          .scope(['defaultScope', {method: ['forSiteId', req.params.siteId]}])
          .findAll({ where: { name: req.body.tags } })
			    .then(tags => {
            tags.forEach((tag) => {
              tagIds.push(tag.id);
            });
            return ideaInstance
              .setTags(tagIds)
              .then(() => {
                return ideaInstance;
              })
			    })
			    .then(ideaInstance => {
            // refetch. now with tags
            let scope = [...req.scope, 'includeVoteCount', 'includeTags']
		        return db.Idea
			        .scope(...scope)
			        .findOne({
				        where: { id: ideaInstance.id, siteId: req.params.siteId }
			        })
			        .then(found => {
				        if ( !found ) throw new Error('Idea not found');
				        responseData = createIdeaJSON(found, req.user, req);
			        })
			        .catch(next);
	        })
			})
			.then(() => {
				res.json(responseData);
			})
			.catch(next);
	})

// delete idea
// ---------
	.delete(auth.can('idea:delete'))
	.delete(function(req, res, next) {
		req.idea
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

	let keys;
	let hasModeratorRights = (req.user.role === 'admin' || req.user.role === 'editor' || req.user.role === 'moderator');

	if (hasModeratorRights) {
		keys = [ 'siteId', 'meetingId', 'userId', 'startDate', 'endDate', 'sort', 'status', 'title', 'posterImageUrl', 'summary', 'description', 'budget', 'extraData', 'location', 'modBreak', 'modBreakUserId', 'modBreakDate', 'tags' ];
	} else {
		keys = [ 'title', 'summary', 'description', 'extraData', 'location', 'tags' ];
	}

	keys.forEach((key) => {
		if (req.body[key]) {
			filteredBody[key] = req.body[key];
		}
	});

	if (hasModeratorRights) {
    if (filteredBody.modBreak) {
      if ( !req.idea || req.idea.modBreak != filteredBody.modBreak ) {
        if (!req.body.modBreakUserId) filteredBody.modBreakUserId = req.user.id;
        if (!req.body.modBreakDate) filteredBody.modBreakDate = new Date().toString();
      }
    } else {
      filteredBody.modBreak = '';
      filteredBody.modBreakUserId = null;
      filteredBody.modBreakDate = null;
    }
  }

	req.body = filteredBody;
}

function createIdeaJSON(idea, user, req) {

	let hasModeratorRights = (user.role === 'admin' || user.role === 'editor' || user.role === 'moderator');

	let can = {
		// edit: user.can('arg:edit', argument.idea, argument),
		// delete: req.user.can('arg:delete', entry.idea, entry),
		// reply: req.user.can('arg:reply', entry.idea, entry),
	};

	let result = idea.toJSON();
	result.config = null;
	result.site = null;
	result.can = can;

  // Fixme: hide email in arguments and their reactions
	function hideEmailsForNormalUsers(args) {
		return args.map((argument) => {
			argument.user.email = hasModeratorRights ? argument.user.email : '';

			if (argument.reactions) {
				argument.reactions = argument.reactions.map((reaction) => {
					reaction.user.email = hasModeratorRights ? reaction.user.email : '';

					return reaction;
				})
			}

			return argument;
		});
	}

	if (idea.argumentsAgainst) {
		result.argumentsAgainst = hideEmailsForNormalUsers(result.argumentsAgainst);
	}

	if (idea.argumentsFor) {
		result.argumentsFor = hideEmailsForNormalUsers(result.argumentsFor);
	}


	if (idea.extraData && idea.extraData.phone) {
		delete result.extraData.phone;
	}
	if (result.extraData) {
		result.extraData.phone =  '';
	}

  // tags
  if (result.tags) {
    result.tags.forEach((tag, i) => {
      result.tags[i] = result.tags[i].name
    });
  }


	/**
	 * In case the votes isset.
	 */
	if (req.site.config.archivedVotes) {
		if (req.query.includeVoteCount && req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable) {
				result.yes = result.extraData.archivedYes;
				result.no = result.extraData.archivedNo;
		}
	}

	if (idea.user) {
		result.user = {
			firstName: idea.user.firstName,
			lastName: idea.user.lastName,
			fullName: idea.user.fullName,
			nickName: idea.user.nickName,
			isAdmin: hasModeratorRights,
			email: hasModeratorRights ? idea.user.email : '',
		};
	} else {
		result.user = {
			isAdmin: hasModeratorRights,
		};
	}

	result.createdAtText = moment(idea.createdAt).format('LLL');

	return result;
}

module.exports = router;
