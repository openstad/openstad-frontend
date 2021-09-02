const Sequelize = require('sequelize');
const express = require('express');
const moment = require('moment');
const createError = require('http-errors');
const config = require('config');
const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const mail = require('../../lib/mail');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results-static');
const isJson = require('../../util/isJson');

const router = express.Router({ mergeParams: true });
const userhasModeratorRights = (user) => {
  return user && (user.role === 'admin' || user.role === 'editor' || user.role === 'moderator');
};

// scopes: for all get requests
router
  .all('*', function(req, res, next) {
    req.scope = ['api', { method: ['onlyVisible', req.user.id, req.user.role] }];

    // in case the votes are archived don't use these queries
    // this means they can be cleaned up from the main table for performance reason
    if (!req.site.config.archivedVotes) {
      if (req.query.includeVoteCount && req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable) {
        req.scope.push('includeVoteCount');
      }

      if (req.query.includeUserVote && req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable && req.user && req.user.id) {
        // ik denk dat je daar niet het hele object wilt?
        req.scope.push({ method: ['includeUserVote', req.user.id] });
      }
    }
    // because includeVoteCount is used in other locations but should only be active if isViewable
    if (req.site && req.site.config && req.site.config.votes && req.site.config.votes.isViewable) {
      req.canIncludeVoteCount = true; // scope.push(undefined) would be easier but creates an error
    }

    /**
     * Old sort for backward compatibility
     */
    let sort = (req.query.sort || '').replace(/[^a-z_]+/i, '') || (req.cookies['idea_sort'] && req.cookies['idea_sort'].replace(/[^a-z_]+/i, ''));
    if (sort) {
      //res.cookie('idea_sort', sort, { expires: 0 });

      if (sort == 'votes_desc' || sort == 'votes_asc') {
        if (req.canIncludeVoteCount) req.scope.push('includeVoteCount'); // het werkt niet als je dat in de sort scope functie doet...
      }
      req.scope.push({ method: ['sort', req.query.sort] });
    }

    if (req.query.mapMarkers) {
      req.scope.push('mapMarkers');
    }

    if (req.query.filters || req.query.exclude) {
      req.scope.push({ method: ['filter', req.query.filters, req.query.exclude] });
    }

    if (req.query.running) {
      req.scope.push('selectRunning');
    }

    if (req.query.includeArguments) {
      req.scope.push({ method: ['includeArguments', req.user.id] });
    }

    if (req.query.includeArgsCount) {
      req.scope.push('includeArgsCount');
    }

    if (req.query.includeTags) {
      req.scope.push('includeTags');
    }


    if (req.query.includePoll) {
      req.scope.push({ method: ['includePoll', req.user.id] });
    }

    if (req.query.tags) {
      let tags = req.query.tags;
      req.scope.push({ method: ['selectTags', tags] });
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

    // todo? volgens mij wordt dit niet meer gebruikt
    // if (req.query.highlighted) {
    //  	query = db.Idea.getHighlighted({ siteId: req.params.siteId })
    // }

    return next();

  });

router.route('/')

  // list ideas
  // ----------
  .get(auth.can('Idea', 'list'))
  .get(pagination.init)
  // add filters
  .get(function(req, res, next) {
    let { dbQuery } = req;

    dbQuery.where = {
      siteId: req.params.siteId,
      ...req.queryConditions,
      ...dbQuery.where,
    };

    if (dbQuery.hasOwnProperty('order')) {
      /**
       * Handle yes/no sorting
       */
      dbQuery.order = dbQuery.order.map(function(sortingQuery) {
        if (sortingQuery[0] === 'yes' || sortingQuery[0] === 'no') {
          return [Sequelize.literal(sortingQuery[0]), sortingQuery[1]];
        }

        return sortingQuery;
      });
    }

    db.Idea
      .scope(...req.scope)
      .findAndCountAll(dbQuery)
      .then(function(result) {
        result.rows.forEach((idea) => {
          idea.site = req.site;
          if (req.query.includePoll && idea.poll) idea.poll.countVotes(!req.query.withVotes);
        });
        const { rows } = result;
        req.results = rows;
        req.dbQuery.count = result.count;

        return next();
      })
      .catch(next);
  })
  .get(auth.useReqUser)
  .get(searchResults)
  .get(pagination.paginateResults)
  .get(function(req, res, next) {
    res.json(req.results);
  })

  // create idea
  // -----------
  .post(auth.can('Idea', 'create'))
  .post(function(req, res, next) {
    if (!req.site) return next(createError(401, 'Site niet gevonden'));
    return next();
  })
  .post(function(req, res, next) {
    if (!(req.site.config && req.site.config.ideas && req.site.config.ideas.canAddNewIdeas)) return next(createError(401, 'Inzenden is gesloten'));
    return next();
  })
  .post(function(req, res, next) {

    try {
      req.body.location = req.body.location ? JSON.parse(req.body.location) : null;
    } catch (err) {
    }

    if (req.body.location && typeof req.body.location == 'object' && !Object.keys(req.body.location).length) {
      req.body.location = null;
    }

    let userId = req.user.id;
    if (req.user.role == 'admin' && req.body.userId) userId = req.body.userId;

    const data = {
      ...req.body,
      siteId: req.params.siteId,
      userId,
      startDate: new Date(),
    };

    let responseData;
    db.Idea
      .authorizeData(data, 'create', req.user, null, req.site)
      .create(data)
      .then(ideaInstance => {

        db.Idea
          .scope(...req.scope)
          .findByPk(ideaInstance.id)
          .then(result => {
            result.site = req.site;
            req.results = result;
            return next();
          });

      })
      .catch(function(error) {
        // todo: dit komt uit de oude routes; maak het generieker
        if (typeof error == 'object' && error instanceof Sequelize.ValidationError) {
          let errors = [];
          error.errors.forEach(function(error) {
            // notNull kent geen custom messages in deze versie van sequelize; zie https://github.com/sequelize/sequelize/issues/1500
            // TODO: we zitten op een nieuwe versie van seq; vermoedelijk kan dit nu wel
            errors.push(error.type === 'notNull Violation' && error.path === 'location' ? 'Kies een locatie op de kaart' : error.message);
          });
          //	res.status(422).json(errors);

          next(createError(422, errors.join(', ')));
        } else {
          next(error);
        }
      });

  })
  .post(function(req, res, next) {

    // tags
    if (!req.body.tags) return next();

    let ideaInstance = req.results;
    ideaInstance
      .setTags(req.body.tags)
      .then(tags => {
        // refetch. now with tags
        let scope = [...req.scope, 'includeTags'];
        if (req.canIncludeVoteCount) scope.push('includeVoteCount');
        return db.Idea
          .scope(...scope)
          .findOne({
            where: { id: ideaInstance.id, siteId: req.params.siteId },
          })
          .then(found => {
            if (!found) throw new Error('Idea not found');
            found.site = req.site;
            req.results = found;
            return next();
          })
          .catch(next);
      });
  })
  .post(function(req, res, next) {
    res.json(req.results);
    if (!req.query.nomail) mail.sendThankYouMail(req.results, 'ideas', req.site, req.user); // todo: optional met config?
  });

// one idea
// --------
router.route('/:ideaId(\\d+)')
  .all(function(req, res, next) {
    var ideaId = parseInt(req.params.ideaId) || 1;

    let scope = [...req.scope];
    if (req.canIncludeVoteCount) scope.push('includeVoteCount');

    db.Idea
      .scope(...scope)
      .findOne({
        where: { id: ideaId, siteId: req.params.siteId },
      })
      .then(found => {
        if (!found) throw new Error('Idea not found');
        found.site = req.site;
        if (req.query.includePoll) { // TODO: naar poll hooks
          if (found.poll) found.poll.countVotes(!req.query.withVotes);
        }
        req.idea = found;
        req.results = req.idea;
        next();
      })
      .catch((err) => {
        console.log('err', err);
        next(err);
      });
  })

  // view idea
  // ---------
  .get(auth.can('Idea', 'view'))
  .get(auth.useReqUser)
  .get(function(req, res, next) {
    res.json(req.results);
  })

  // update idea
  // -----------
  .put(auth.useReqUser)
  .put(function(req, res, next) {
    req.tags = req.body.tags;
    return next();
  })
  .put(function(req, res, next) {

    var idea = req.results;

    if (!(idea && idea.can && idea.can('update'))) return next(new Error('You cannot update this Idea'));

    if (req.body.location) {
      try {
        req.body.location = JSON.parse(req.body.location || null);
      } catch (err) {
      }

      if (req.body.location && typeof req.body.location === 'object' && !Object.keys(req.body.location).length) {
        req.body.location = undefined;
      }
    } else {
      if (req.body.location === null) {
        req.body.location = JSON.parse(null);
      }
    }

    let data = {
      ...req.body,
    };

    if (userhasModeratorRights(req.user)) {
      if (data.modBreak) {
        data.modBreakUserId = req.body.modBreakUserId = req.user.id;
        data.modBreakDate = req.body.modBreakDate = new Date().toString();
      }
    }

    idea
      .authorizeData(data, 'update')
      .update(data)
      .then(result => {
        result.site = req.site;
        req.results = result;
        next();
      })
      .catch(next);
  })
  .put(function(req, res, next) {

    // tags
    if (!req.tags) return next();

    let tagIds = [];
    let responseData;
    let ideaInstance = req.results;

    ideaInstance
      .setTags(req.tags)
      .then(result => {
        // refetch. now with tags
        let scope = [...req.scope, 'includeTags'];
        if (req.canIncludeVoteCount) scope.push('includeVoteCount');
        return db.Idea
          .scope(...scope)
          .findOne({
            where: { id: ideaInstance.id, siteId: req.params.siteId },
          })
          .then(found => {
            if (!found) throw new Error('Idea not found');

            if (req.query.includePoll) { // TODO: naar poll hooks
              if (found.poll) found.poll.countVotes(!req.query.withVotes);
            }
            req.results = found;
            next();
          })
          .catch(next);
      });

  })
  .put(function(req, res, next) {
    res.json(req.results);
  })

  // delete idea
  // ---------
  .delete(auth.useReqUser)
  .delete(function(req, res, next) {
    const idea = req.results;
    if (!(idea && idea.can && idea.can('delete'))) return next(new Error('You cannot delete this idea'));

    idea
      .destroy()
      .then(() => {
        res.json({ 'idea': 'deleted' });
      })
      .catch(next);
  });

module.exports = router;
