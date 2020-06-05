const Promise = require('bluebird');
const express = require('express');
const db      = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');

let router = express.Router({mergeParams: true});

router.route('/')

// list tags
// --------------
	.get(auth.can('Tag', 'list'))
	.get(pagination.init)
	.get(function(req, res, next) {
		req.scope = ['defaultScope'];
    req.scope.push({method: ['forSiteId', req.params.siteId]});

		db.Tag
			.scope(...req.scope)
			.findAndCountAll({ offset: req.pagination.offset, limit: req.pagination.limit })
			.then(result => {
				req.results = result.rows;
				req.pagination.count = result.count;
				next();
			})
			.catch(next);
	})
	.get(auth.useReqUser)
	.get(pagination.paginateResults)
	.get(function(req, res, next) {
		res.json(req.results);
  })

// create tag
// ---------------
  .post(auth.can('Tag', 'create'))
	.post(function(req, res, next) {
		let data = {
			name   : req.body.name,
			siteId : req.params.siteId,
		};
    
		db.Tag
			.authorizeData(data, 'create', req.user)
			.create(data)
			.then(result => {
				res.json(result);
			})
			.catch(next);
	})

	// with one existing tag
	// --------------------------
	router.route('/:tagId(\\d+)')
		.all(function(req, res, next) {
			var tagId = parseInt(req.params.tagId);
      if (!tagId) next('No tag id found');

			req.scope = ['defaultScope'];
			req.scope.push({method: ['forSiteId', req.params.siteId]});

			db.Tag
				.scope(...req.scope)
        .findOne({ where: { id: tagId } })
				.then(found => {
					if ( !found ) throw new Error('Tag not found');
					req.results = found;
					next();
				})
				.catch(next);
		})

	// view tag
	// -------------
	.get(auth.can('Tag', 'view'))
	.get(auth.useReqUser)
		.get(function(req, res, next) {
			res.json(req.results);
		})

// update tag
// ---------------
	.put(auth.useReqUser)
	.put(function(req, res, next) {
		var tag = req.results;
    if (!( tag && tag.can && tag.can('update') )) return next( new Error('You cannot update this tag') );
		tag
			.authorizeData(req.body, 'update')
			.update(req.body)
			.then(result => {
				res.json(result);
			})
			.catch(next);
	})

	// delete tag
	// ---------------
	.delete(auth.can('Tag', 'delete'))
		.delete(function(req, res, next) {
			req.results
				.destroy()
				.then(() => {
					res.json({ "tag": "deleted" });
				})
				.catch(next);
		})

module.exports = router;
