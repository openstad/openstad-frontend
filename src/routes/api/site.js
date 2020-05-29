const Promise = require('bluebird');
const express = require('express');
const db      = require('../../db');
const auth    = require('../../auth');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results');

let router = express.Router({mergeParams: true});

router.route('/')

// list sites
// ----------
	.get(auth.can('sites:list'))
	.get(pagination.init)
	.get(function(req, res, next) {
		db.Site
			.findAndCountAll({ offset: req.pagination.offset, limit: req.pagination.limit })
			.then( result => {
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
      let site = record.toJSON()
			if (!( req.user && req.user.role && req.user.role == 'admin' )) {
        site.config = undefined;
			}
      records[i] = site;
    });
		res.json(req.results);
  })

// create site
// -----------
	.post(auth.can('site:create'))
	.post(function(req, res, next) {
		db.Site
			.create(req.body)
			.then(result => {
				res.json(result);
			})
	})

// one site routes: get site
// -------------------------
router.route('/:siteIdOrDomain') //(\\d+)
	.all(auth.can('site:view'))
	.all(function(req, res, next) {
		const siteIdOrDomain = req.params.siteIdOrDomain;
		let query;

		if (isNaN(siteIdOrDomain)) {
			query = {	where: { domain: siteIdOrDomain } }
		} else {
			query = { where: { id: parseInt(siteIdOrDomain) } }
		}

		db.Site
			.findOne(query)
			.then(found => {
				if ( !found ) throw new Error('Site not found');
				req.site = found;
				next();
			})
			.catch(next);
	})

// view site
// ---------
	.get(function(req, res, next) {

		let site = req.site.toJSON();
		if (!( req.user && req.user.role && req.user.role == 'admin' )) {
			site.config = undefined;
		}

		res.json(site);

	})

// update site
// -----------
	.put(auth.can('site:edit'))
	.put(function(req, res, next) {
		req.site
			.update(req.body)
			.then(result => {
				res.json(result);
			})
			.catch(next);
	})

// delete site
// ---------
	.delete(auth.can('site:delete'))
	.delete(function(req, res, next) {
		req.site
			.destroy()
			.then(() => {
				res.json({ "site": "deleted" });
			})
			.catch(next);
	})

module.exports = router;
