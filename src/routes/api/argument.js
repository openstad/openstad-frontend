const createError = require('http-errors');
const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results-static');

const router = require('express-promise-router')({ mergeParams: true });

// scopes: for all get requests
router
  .all('*', function(req, res, next) {
    req.scope = ['defaultScope', 'withIdea'];
    req.scope.push({ method: ['forSiteId', req.params.siteId] });

    if (req.query.includeReactionsOnReactions) {
      req.scope.push('includeReactionsOnReactions');
      req.scope.push({ method: ['includeReactionsOnReactions', req.user.id] });
    }

    if (req.query.withVoteCount) {
      req.scope.push({ method: ['withVoteCount', 'argument'] });
    }

    if (req.query.withUserVote) {
      req.scope.push({ method: ['withUserVote', 'argument', req.user.id] });
    }

    return next();

  })
  .all('*', function(req, res, next) {
    // zoek het idee
    // todo: ik denk momenteel alleen nog gebruikt door create; dus zet hem daar neer
    let ideaId = parseInt(req.params.ideaId) || 0;
    if (!ideaId) return next();
    db.Idea.findByPk(ideaId)
      .then(idea => {
        if (!idea || idea.siteId != req.params.siteId) return next(createError(400, 'Idea not found'));
        req.idea = idea;
        return next();
      });
  })
  .all('/:argumentId(\\d+)(/vote)?', function(req, res, next) {

    // with one existing argument
    // --------------------------

    var argumentId = parseInt(req.params.argumentId) || 1;

    let sentiment = req.query.sentiment;
    let where = { id: argumentId };

    if (sentiment && (sentiment == 'against' || sentiment == 'for')) {
      where.sentiment = sentiment;
    }

    db.Argument
      .scope(...req.scope)
      .findOne({
        where,
      })
      .then(entry => {
        if (!entry) throw new Error('Argument not found');
        req.results = entry;
        return next();
      })
      .catch(next);

  });

router.route('/')

  // list arguments
  // --------------
  .get(auth.can('Argument', 'list'))
  .get(pagination.init)
  .get(function(req, res, next) {
    let { dbQuery } = req;

    let ideaId = parseInt(req.params.ideaId) || 0;
    let where = {};
    if (ideaId) {
      where.ideaId = ideaId;
    }
    let sentiment = req.query.sentiment;
    if (sentiment && (sentiment == 'against' || sentiment == 'for')) {
      where.sentiment = sentiment;
    }

    return db.Argument
      .scope(...req.scope)
      .findAndCountAll(
        {
          where,
          ...dbQuery,
        },
      )
      .then(function(result) {
        req.results = result.rows;
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

  // create argument
  // ---------------
  .post(auth.can('Argument', 'create'))
  .post(auth.useReqUser)
  .post(function(req, res, next) {

    if (!req.idea) return next(createError(400, 'Inzending niet gevonden'));
    // todo: dit moet een can functie worden
    if (req.user.role != 'admin' && req.idea.status != 'OPEN') return next(createError(400, 'Reactie toevoegen is niet mogelijk bij planen met status: ' + req.idea.status));
    next();
  })
  .post(function(req, res, next) {
    if (!req.body.parentId) return next();
    db.Argument
      .scope(
        'defaultScope',
        'withIdea',
      )
      .findByPk(req.body.parentId)
      .then(function(argument) {
        if (!(argument && argument.can && argument.can('reply', req.user))) return next(new Error('You cannot reply to this argument'));
        return next();
      });
  })
  .post(function(req, res, next) {

    let userId = req.user.id;
    if (req.user.role == 'admin' && req.body.userId) userId = req.body.userId;
    
    let data = {
      ...req.body,
      ideaId: req.params.ideaId,
      userId,
    };


    db.Argument
      .authorizeData(data, 'create', req.user)
      .create(data)
      .then(result => {

        db.Argument
          .scope(
            'defaultScope',
            'withIdea',
            { method: ['withVoteCount', 'argument'] },
            { method: ['withUserVote', 'argument', req.user.id] },
          )
          .findByPk(result.id)
          .then(function(argument) {
            res.json(argument);
          });

      })
      .catch(next);

  });

router.route('/:argumentId(\\d+)')

  // view argument
  // -------------
  .get(auth.can('Argument', 'view'))
  .get(auth.useReqUser)
  .get(function(req, res, next) {
    res.json(req.results);
  })

  // update argument
  // ---------------
  .put(auth.useReqUser)
  .put(function(req, res, next) {
    var argument = req.results;
    if (!(argument && argument.can && argument.can('update'))) return next(new Error('You cannot update this argument'));
    argument
      .authorizeData(req.body, 'update')
      .update(req.body)
      .then(result => {
        res.json(result);
      })
      .catch(next);
  })

  // delete argument
  // --------------
  .delete(auth.useReqUser)
  .delete(function(req, res, next) {
    const argument = req.results;
    if (!( argument && argument.can && argument.can('delete') )) return next( new Error('You cannot delete this argument') );

    argument
      .destroy()
      .then(() => {
        res.json({ 'argument': 'deleted' });
      })
      .catch(next);
  });

router.route('/:argumentId(\\d+)/vote')

  // vote for argument
  // -----------------

  .post(auth.useReqUser)
  .post(function(req, res, next) {
    var user = req.user;
    var argument = req.results;
    var opinion = 'yes'; // todo

    if (!(argument && argument.can && argument.can('vote'))) return next(new Error('You cannot vote for this argument'));

    argument.addUserVote(user, opinion, req.ip)
      .then(function(voteRemoved) {

        db.Argument
          .scope(
            'defaultScope',
            'withIdea',
            { method: ['withVoteCount', 'argument'] },
            { method: ['withUserVote', 'argument', req.user.id] },
          )
          .findByPk(argument.id)
          .then(function(argument) {
            req.results = argument;
            return next();
          });

      })
      .catch(next);
  });

// output
// ------
// TODO: nu als voorbeeld, alleen gebruikt door post vote, maar kan voor alle routes
// de vraag is: wil ik dat
router
  .all('*', function(req, res, next) {
    res.json(req.results);
  });


module.exports = router;
