const Promise = require('bluebird');
const express = require('express');
const db      = require('../../db');
const mail = require('../../lib/mail');
const moment = require('moment-timezone');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results');

let router = express.Router({mergeParams: true});

router.route('/:formId([a-zA-Z0-9\-\_]*)')
// list submissions
// --------------
	.get(auth.can('Submission', 'list'))
	.get(pagination.init)
	.get(function(req, res, next) {
		let formId = req.params.formId.replace('/', ''),
		where = { formId };
		
		req.scope = ['defaultScope'];
		db.Submission
			.scope(...req.scope)
			.findAndCountAll({ where, offset: req.dbQuery.offset, limit: req.dbQuery.limit })
			.then(function( result ) {
        req.results = result.rows.map( entry => {
					let submittedData = entry.submittedData,
						orderedData = {};
					
					// When we get the submittedData back from MySQL, the keys are in the wrong order.
					// We inserted a number in front of the key before inserting the data, so now we can sort on that
					Object.keys(submittedData).sort(function (a, b) {
						let keyA = a.split(':')[0],
						keyB = b.split(':')[0];
						
						if (keyA < keyB) {
							return -1;
						} else if (keyA > keyB) {
							return 1;
						}
						
						return 0;
					}).forEach(function (key) {
						var newKey = key.split(':');
						orderedData[newKey.length > 1 ? newKey[1] : newKey[0]] = submittedData[key];
					});
					
					entry.submittedData = orderedData;
					entry.createdAt = moment(entry.createdAt).format('LLL');
					return entry;
				});
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

	router.route('/')
	
// create submission
// ---------------
  .post(auth.can('Submission', 'create'))
	.post(function(req, res, next) {
		let data = {
			submittedData     : req.body.submittedData,
			siteId      			: req.params.siteId,
			userId      			: req.user.id,
			formId 					: req.body.formId || 'default',
		};
		
		db.Submission
			.authorizeData(data, 'create', req.user)
			.create(data)
			.then(result => {
				res.json(result);
				
				if(req.body.sendMail === '1') {
					mail.sendSubmissionConfirmationMail(result, req.body.formId, req.body.emailSubject, req.body.submittedData,req.site);
					mail.sendSubmissionAdminMail(result, req.body.emailSubjectAdmin, req.body.submittedData, req.site);
				}
			})
	})

	// with one existing submission
	// --------------------------
	router.route('/:submissionId(\\d+)')
		.all(function(req, res, next) {
			var submissionId = parseInt(req.params.submissionId);

			req.scope = ['defaultScope'];
			req.scope.push({method: ['forSiteId', req.params.siteId]});

		//	let where = { siteId }

			db.Submission
				.scope(...req.scope)
		//		.find({ where })
        .find()
				.then(found => {
					if ( !found ) throw new Error('Submission not found');
					req.results = found;
					next();
				})
				.catch(next);
		})

// view submission
// -------------
	.get(auth.can('Submission', 'view'))
	.get(auth.useReqUser)
	.get(function(req, res, next) {
		res.json(req.results);
	})

	// update submission
	// ---------------
	.put(auth.useReqUser)
		.put(function(req, res, next) {
		  var submission = req.results;
      if (!( submission && submission.can && submission.can('update') )) return next( new Error('You cannot update this submission') );
		  submission
				.update(req.body)
				.then(result => {
					res.json(result);
				})
				.catch(next);
		})

// delete submission
// ---------------
	.delete(auth.can('Submission', 'delete'))
	.delete(function(req, res, next) {
		req.results
			.destroy()
			.then(() => {
				res.json({ "submission": "deleted" });
			})
			.catch(next);
	})

module.exports = router;
