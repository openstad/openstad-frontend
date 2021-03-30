const createError = require('http-errors')
const db          = require('../../db');
const auth        = require('../../middleware/sequelize-authorization-middleware');
const pagination  = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results-static');

const router = require('express-promise-router')({mergeParams: true});

router

   // scopes
	.all('*', function(req, res, next) {

		req.scope = ['defaultScope', 'withIdea'];
		req.scope.push({method: ['forSiteId', req.params.siteId]});

		if (req.query.withVoteCount) {
      // votes are counted in model.voteCount
			req.scope.push({method: ['withVotes', 'poll', req.user.id]});
		}

		if (req.query.withUserVote) {
			req.scope.push({method: ['withUserVote', 'poll', req.user.id]});
		}

		if (req.query.withVotes) {
			req.scope.push({method: ['withVotes', 'poll', req.user.id]});
		}

		return next();

	})

router.route('/')

// list polls
// --------------
  .get(auth.can('Poll', 'list'))
	.get(pagination.init)
	.get(function(req, res, next) {

		let ideaId = parseInt(req.params.ideaId) || 0;
		let where = {};
		if (ideaId) {
			where.ideaId = ideaId;
		}

		return db.Poll
			.scope(...req.scope)
			.findAndCountAll({ where, offset: req.dbQuery.offset, limit: req.dbQuery.limit })
			.then(function( result ) {
        result.rows.forEach((poll) => {
          if (req.query.withVoteCount) poll.countVotes(!req.query.withVotes);
        });
        req.results = result.rows;
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

// create poll
// ---------------
  .post(auth.can('Poll', 'create'))
	.post(function(req, res, next) {
		// find idea
		let ideaId = parseInt(req.params.ideaId) || 0;
		if (!ideaId) return next(createError(404, 'Idea not found'));
		db.Idea.findByPk(ideaId)
			.then( idea => {
				if (!idea || idea.siteId != req.params.siteId) return next(createError(400, 'Idea not found'));
				req.idea = idea;
				return next();
			})
	})
	.post(auth.useReqUser)
	.post(function(req, res, next) {
    // validations
    if (!req.site.config.polls || req.site.config.polls.canAddPolls != true) return next( createError(400, 'Poll toevoegen is niet toegestaan') );
    if (!req.idea.auth.canAddPoll(req.user, req.idea)) return next( createError(400, 'Poll toevoegen is niet toegestaan 2') );
		next();
	})
	.post(function(req, res, next) {

		let data = {
      ...req.body,
			ideaId: req.idea.id,
			userId: req.user.id,
      status: 'OPEN',
		}

		db.Poll
			.authorizeData(data, 'create', req.user)
			.create(data)
			.then(result => {

				db.Poll
          .scope(
					  'defaultScope',
            'withIdea',
					  {method: ['withUserVote', 'poll', req.user.id]},
				  )
					.findByPk(result.id)
					.then(function( poll ) {
            poll.auth.user = req.user;
						res.json(poll);
					});

			})
			.catch(next);

	})

// one poll
// --------
router.route('/:pollId(\\d+)')
	.all(function(req, res, next) {
		var pollId = parseInt(req.params.pollId) || 1;
    let scope = req.scope
    if (req.method == 'PUT') scope.push('withVotes');
		db.Poll
			.scope(scope)
			.findOne({
				where: { id: pollId, ideaId: req.params.ideaId }
			})
			.then(found => {
				if ( !found ) throw new Error('Poll not found');
        if (req.query.withVoteCount) found.countVotes(!req.query.withVotes);

		    req.results = found;
				next();
			})
			.catch((err) => {
				console.log('err', err)
				next(err);
			});
	})
	.all(auth.useReqUser)

// view poll
// -------------
	.get(auth.can('Poll', 'view'))
	.get(function(req, res, next) {
		res.json(req.results);
	})

// update poll
// ---------------
	.put(auth.useReqUser)
	.put(function(req, res, next) {
		var poll = req.results;
    if (!( poll && poll.can && poll.can('update') )) return next( new Error('You cannot update this poll') );
		poll
			.authorizeData(req.body, 'update')
			.update(req.body)
			.then(result => {
				res.json(result);
			})
			.catch(next);
	})

// delete poll
// ---------------
	.delete(function(req, res, next) {
		var poll = req.results;
    if (!( poll && poll.can && poll.can('delete') )) return next( new Error('You cannot delete this poll') );
		req.results
			.destroy()
			.then(() => {
				res.json({ "poll": "deleted" });
			})
			.catch(next);
	})


// vote for poll
// -----------------
router.route('/:pollId(\\d+)/vote')

	.all(function(req, res, next) {
		var pollId = parseInt(req.params.pollId) || 1;
		db.Poll
			.scope(...req.scope)
			.findOne({
				where: { id: pollId, ideaId: req.params.ideaId }
			})
			.then(found => {
				if ( !found ) throw new Error('Poll not found');
		    req.results = found;
				next();
			})
			.catch((err) => {
				console.log('err', err)
				next(err);
			});
	})
	.all(auth.useReqUser)

	.post(function( req, res, next ) {

		let poll = req.results;
    if (!( poll && poll.can && poll.can('vote') )) return next( new Error('You cannot vote for this poll') );

    let pollVote;
		db.PollVote
			.scope('defaultScope', 'withPoll')
			.findOne({
				where: { pollId: poll.id, userId: req.user.id }
			})
			.then(found => {
		    pollVote = found;

        let data = {
          choice: req.body.choice,
        }

        if (pollVote) {
          pollVote.auth.user = req.user;
		      pollVote
			      .authorizeData(data, 'update')
			      .update(data)
			      .then(result => {
              req.pollVoteId = pollVote.id
              return next();
			      })
        } else {
          data.pollId = poll.id;
          data.userId = req.user.id;
          data.ip = req.ip;
		      db.PollVote
			      .authorizeData(data, 'create', req.user)
			      .create(data)
			      .then(result => {
              req.pollVoteId = result.id
              return next();
			      })

        }
      })
			.catch((err) => {
				console.log('err', err)
				next(err);
			});
    
	})
	.post(function( req, res, next ) {
		db.PollVote
      .scope(
				'defaultScope',
			)
			.findByPk(req.pollVoteId)
			.then(function( poll ) {
        poll.auth.user = req.user;
				res.json(poll);
			});

  });

// output
// ------
// TODO: nu als voorbeeld, alleen gebruikt door post vote, maar kan voor alle routes
// de vraag is: wil ik dat
router
	.all('*', function(req, res, next) {
		res.json(req.results);
  })


module.exports = router;
