const Promise = require('bluebird');
const express = require('express');
const db      = require('../../db');
const auth    = require('../../auth');
const mail = require('../../lib/mail');

let router = express.Router({mergeParams: true});

router.route('/:formId([a-zA-Z0-9\-\_]*)')
// list submissions
// --------------
	.get(auth.can('submissions:list'))
	.get(function(req, res, next) {
		let formId = req.params.formId.replace('/', ''),
		where = { formId };
		
		req.scope = ['defaultScope'];
	//	req.scope.push({method: ['forSiteId', req.params.siteId]});

		db.Submission
			.scope(...req.scope)
			.findAll({ where })
			.then( found => {
				return found.map( entry => {
					let data = entry.toJSON();
					let submittedData = data.submittedData,
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
					
					data.submittedData = orderedData;
					return data;
				});
			})
			.then(function( found ) {
				res.json(found);
			})
			.catch(next);
	});

router.route('/')

// create submission
// ---------------
  .post(auth.can('submissions:create'))
	.post(function(req, res, next) {
		let data = {
			submittedData     : req.body.submittedData,
			siteId      			: req.params.siteId,
			userId      			: req.user.id,
			formId 					: req.body.formId || 'default',
		};
		
		db.Submission
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
					req.submission = found;
					next();
				})
				.catch(next);
		})

	// view submission
	// -------------
		.get(auth.can('submissions:view'))
		.get(function(req, res, next) {
			res.json(req.submission);
		})

	// update submission
	// ---------------
		.put(auth.can('submissions:edit'))
		.put(function(req, res, next) {
			req.submission
				.update(req.body)
				.then(result => {
					res.json(result);
				})
				.catch(next);
		})

	// delete submission
	// ---------------
		.delete(auth.can('submissions:delete'))
		.delete(function(req, res, next) {
			req.submission
				.destroy()
				.then(() => {
					res.json({ "submission": "deleted" });
				})
				.catch(next);
		})

module.exports = router;
