const Promise			= require('bluebird');
const moment			= require('moment');
const createError = require('http-errors')
const db          = require('../../db');
const auth        = require('../../auth');

let router = require('express-promise-router')({mergeParams: true});

// scopes: for all get requests
router
	.all('*', function(req, res, next) {

		req.scope = ['defaultScope', 'withIdea'];
		req.scope.push({method: ['forSiteId', req.params.siteId]});

		if (req.query.includeReactionsOnReactions) {
			req.scope.push('includeReactionsOnReactions');
			req.scope.push({method: ['includeReactionsOnReactions', req.user.id]});
		}

		if (req.query.withVoteCount) {
			req.scope.push({method: ['withVoteCount', 'argument']});
		}

		if (req.query.withUserVote) {
			req.scope.push({method: ['withUserVote', 'argument', req.user.id]});
		}

		return next();

	})
	.all('*', function(req, res, next) {
		// zoek het idee
		let ideaId = parseInt(req.params.ideaId) || 0;
		if (!ideaId) return next();
		db.Idea.findByPk(ideaId)
			.then( idea => {
				if (!idea || idea.siteId != req.params.siteId) return next(createError(400, 'Idea not found'));
				req.idea = idea;
				return next();
			})
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
		if (sentiment && (sentiment == 'against' || sentiment == 'for')) {
			where.sentiment = sentiment;
		}

		return db.Argument
			.scope(...req.scope)
			.findAll({ where })
			.then( found => {
				return found.map( entry => {
          
					return createArgumentJSON(entry, req.user);
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
    if (!req.idea) return next( createError(400, 'Inzending niet gevonden') );
    if (req.idea.status != 'OPEN') return next( createError(400, 'Reactie toevoegen is niet mogelijk') );
		next();
	})
	.post(function(req, res, next) {

		let data = {
			description : req.body.description,
			sentiment   : req.body.sentiment || 'for',
			label       : req.body.label,
			parentId    : req.body.parentId,
			ideaId      : req.params.ideaId,
			userId      : req.user.id,
		}

		db.Argument
			.create(data)
			.then(result => {

				db.Argument.scope(
					{method: ['withVoteCount', 'argument']},
					{method: ['withUserVote', 'argument', req.user.id]},
					'withUser'
				)
					.findByPk(result.id)
					.then(function( argument ) {

						// todo: de can dingen

            

						let result = createArgumentJSON(argument, req.user);
						res.json(result);
					});

			})
			.catch(next);

	})

	// with one existing argument
	// --------------------------
	router.route('/:argumentId(\\d+)')
	.all(function(req, res, next) {

			var argumentId = parseInt(req.params.argumentId) || 1;

			let ideaId = parseInt(req.params.ideaId) || 0;
			let sentiment = req.query.sentiment;
			let where = { ideaId, id: argumentId }

			if (sentiment && (sentiment == 'against' || sentiment == 'for')) {
				where.sentiment = sentiment;
			}

			db.Argument
				.scope(...req.scope)
				.findOne({
					where
				})
				.then(entry => {
					if ( !entry ) throw new Error('Argument not found');
					req.argumentJSON = createArgumentJSON(entry, req.user);
					req.argument = entry;

					db.Idea // add idea for auth checks
						.scope()
						.findOne({
							where: { id: req.argument.ideaId }
						})
						.then(entry => {
							if ( !entry ) throw new Error('Idea not found');
							req.idea = entry;
							next();
						})

				})
				.catch(next);
		})

	// view argument
	// -------------
		.get(auth.can('argument:view'))
		.get(function(req, res, next) {
			res.json(req.argumentJSON);
		})

	// update argument
	// ---------------
		.put(auth.can('argument:edit'))
		.put(function(req, res, next) {
			req.argument
			// todo: filter body
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

// with one existing argument
// --------------------------
router.route('/:argumentId(\\d+)/vote')
	.all(function(req, res, next) {

		// dit staat hierboven nog eens en moet nog verder naar boven, maar dan moet eerst de bovenste route beter zodat die op argumenten werkt

		var argumentId = parseInt(req.params.argumentId) || 1;

		let ideaId = parseInt(req.params.ideaId) || 0;
		let sentiment = req.query.sentiment;
		let where = { ideaId, id: argumentId }

		if (sentiment && (sentiment == 'against' || sentiment == 'for')) {
			where.sentiment = sentiment;
		}

		db.Argument
			.scope(...req.scope)
			.findOne({
				where
			})
			.then(entry => {
				if ( !entry ) throw new Error('Argument not found');
				req.argument = entry;
				next();
			})
			.catch(next);

	})
	.post(auth.can('argument:vote'))
	.post(function( req, res, next ) {
		var user     = req.user;
		var argument = req.argument;
		var idea     = req.idea;
		var opinion  = 'yes'; // todo

		req.argument.addUserVote(user, opinion, req.ip)
			.then(function( voteRemoved ) {

				db.Argument.scope(
					{method: ['withVoteCount', 'argument']},
					{method: ['withUserVote', 'argument', user.id]},
					'withUser'
				)
					.findByPk(argument.id)
					.then(function( argument ) {

						// todo: de can dingen

						argument = argument.toJSON();
						argument.user = {
							nickName: argument.user.nickName || argument.user.fullName,
							isAdmin: argument.user.role == 'admin',
							email: req.user.role == 'admin' ? argument.user.email : '',
						};

						res.json(argument);
					});

			})
			.catch(next);
	})
	.all(function( err, req, res, next ) {
		// todo
		if( err.status == 403 && req.accepts('html') ) {
			var ideaId = req.params.ideaId;
			var argId  = req.params.argId;
			req.flash('error', err.message);
			res.success(`/account/register?ref=/plan/${ideaId}#arg${argId}`);
		} else {
			next(err);
		}
	});

// helper functions
function createArgumentJSON(argument, user) {

	let can = {
		edit: user.role == 'admin' || user.id == argument.user.id,
		delete: user.role == 'admin' || user.id == argument.user.id,
		reply: !argument.parentId,
	};

	let result = argument.toJSON();
	result.can = can;
	result.user = {
		firstName: argument.user.firstName,
		lastName: argument.user.lastName,
		fullName: argument.user.fullName,
		nickName: argument.user.nickName,
		isAdmin: user.role == 'admin',
		email: user.role == 'admin' ? argument.user.email : '',
	};
	result.createdAtText = moment(argument.createdAt).format('LLL');

	result.reactions = argument.reactions && argument.reactions.map( entry => {
		return createArgumentJSON(entry, user);
	});


	delete result.idea;

	return result;
}

module.exports = router;
