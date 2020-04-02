const Promise = require('bluebird');
const Sequelize = require('sequelize');
const express = require('express');
const moment			= require('moment');
const createError = require('http-errors')
const config = require('config');
const db = require('../../db');
const auth = require('../../auth');
const mail = require('../../lib/mail');

let router = express.Router({mergeParams: true});

// scopes: for all get requests
router
	.all('*', function(req, res, next) {

		req.scope = ['api'];

		var sort = (req.query.sort || '').replace(/[^a-z_]+/i, '') || (req.cookies['article_sort'] && req.cookies['article_sort'].replace(/[^a-z_]+/i, ''));
		if (sort) {
			res.cookie('article_sort', sort, { expires: 0 });
			req.scope.push({ method: ['sort', req.query.sort]});
		}

		if (req.query.mapMarkers) {
			req.scope.push('mapMarkers');
		}

		if (req.query.running) {
			req.scope.push('selectRunning');
		}

		if (req.query.includePosterImage) {
			req.scope.push('includePosterImage');
		}

		if (req.query.includeUser) {
			req.scope.push('includeUser');
		}

		return next();

	})

router.route('/')

// list articles
// ----------
	.get(auth.can('articles:list'))
	.get(function(req, res, next) {
		db.Article
			.scope(...req.scope)
			.findAll({ where: { siteId: req.params.siteId } })
			.then( found => {
				return found.map( entry => {
					return createArticleJSON(entry, req.user, req);
				});
			})
			.then(function( found ) {
				res.json(found);
			})
			.catch(next);
	})

// create article
// -----------
	.post(auth.can('article:create'))
	.post(function(req, res, next) {
		if (!req.site) return next(createError(401, 'Site niet gevonden'));
		return next();
	})
	.post(function( req, res, next ) {
		if (!(req.site.config && req.site.config.articles && req.site.config.articles.canAddNewArticles)) return next(createError(401, 'Inzenden is gesloten'));
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

		db.Article
			.create(req.body)
			.then(result => {
				res.json(createArticleJSON(result, req.user, req));
				mail.sendThankYouMail(result, req.user, req.site) // todo: optional met config?
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

// one article
// --------
router.route('/:articleId(\\d+)')
	.all(function(req, res, next) {
		var articleId = parseInt(req.params.articleId) || 1;

		db.Article
			.findOne({
				where: { id: articleId, siteId: req.params.siteId }
			})
			.then(found => {
				if ( !found ) throw new Error('Article not found');
				req.article = found;
				next();
			})
			.catch(next);
	})

// view article
// ---------
	.get(auth.can('article:view'))
	.get(function(req, res, next) {
		res.json(createArticleJSON(req.article, req.user, req));
	})

// update article
// -----------
	.put(function(req, res, next) {
    next()
  })
	.put(auth.can('article:edit'))
	.put(function(req, res, next) {
		filterBody(req)
		if (req.body.location) {
			try {
				req.body.location = JSON.parse(req.body.location || null);
			} catch(err) {}
		} else {
			req.body.location = JSON.parse(null);
		}

		req.article
			.update(req.body)
			.then(result => {
				res.json(createArticleJSON(result, req.user, req));
			})
			.catch(next);
	})

// delete article
// ---------
	.delete(auth.can('article:delete'))
	.delete(function(req, res, next) {
		req.article
			.destroy()
			.then(() => {
				res.json({ "article": "deleted" });
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
		keys = [ 'siteId', 'meetingId', 'userId', 'startDate', 'endDate', 'sort', 'status', 'title', 'posterImageUrl', 'summary', 'description', 'budget', 'extraData', 'location', 'modBreak', 'modBreakUserId', 'modBreakDate' ];
	} else {
		keys = [ 'title', 'summary', 'description', 'extraData', 'location' ];
	}

	keys.forEach((key) => {
		if (req.body[key]) {
			filteredBody[key] = req.body[key];
		}
	});

	if (hasModeratorRights) {
    if (filteredBody.modBreak) {
      if ( !req.article || req.article.modBreak != filteredBody.modBreak ) {
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

function createArticleJSON(article, user, req) {
	let hasModeratorRights = (user.role === 'admin' || user.role === 'editor' || user.role === 'moderator');

	let can = {
		// edit: user.can('arg:edit', argument.article, argument),
		// delete: req.user.can('arg:delete', entry.article, entry),
		// reply: req.user.can('arg:reply', entry.article, entry),
	};

	let result = article.toJSON();
	result.config = null;
	result.site = null;
	result.can = can;

	if (article.extraData && article.extraData.phone && hasModeratorRights) {
		delete result.extraData.phone;
	}


	if (article.user) {
		result.user = {
			firstName: article.user.firstName,
			lastName: article.user.lastName,
			fullName: article.user.fullName,
			nickName: article.user.nickName,
			isAdmin: hasModeratorRights,
			email: hasModeratorRights ? article.user.email : '',
		};
	} else {
		result.user = {
			isAdmin: hasModeratorRights,
		};
	}

	result.createdAtText = moment(article.createdAt).format('LLL');

	return result;
}

module.exports = router;
