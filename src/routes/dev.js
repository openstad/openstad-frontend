var express = require('express');
var config  = require('config');
var log     = require('debug')('app:http')
var db      = require('../db');
// var mail    = require('../lib/mail');

module.exports = function( app ) {
	if( !config.get('debug') ) {
		return;
	}
	log('initiating dev routes');

	var router = express.Router();
	app.use('/dev', router);

	router.get('/login/:userId', function( req, res, next ) {
		var userId = Number(req.params.userId);
		req.setSessionUser(userId);
		res.success('/');
	});

	router.get('/logout', function( req, res ) {
		req.session.destroy();
		res.success('/', true);
	});

	router.post('/reset_fixtures', function( req, res, next ) {
		db.sequelize.sync({force: true}).then(function() {
			require('../../../fixtures')(db).then(function() {
				res.json(true);
			});
		}).catch(next);
	});

	router.get('/csrf_token', function( req, res, next ) {
		res.format({
			html: function() {
				next(createError(406))
			},
			json: function() {
				res.json({token: req.csrfToken()});
			}
		});
	});

	router.get('/randomize_idea_sort', function( req, res, next ) {
		var cron = require('../../cron/randomize_idea_sort');
		cron.onTick().then(function() {
			res.send()
		})
		.catch(next);
	});

	router.get('/fonts', function( req, res, next ) {
		res.out('test/fonts', false);
	});
	router
		.route('/delete-user-budget-vote')
		.get(function( req, res, next ) {

			if (!req.session.userAccessToken) return res.success('/begroten', true);

			// get the user info using the access token
			let url = config.authorization['auth-server-url'] + config.authorization['auth-server-get-user-path'];
			url = url.replace(/\[\[clientId\]\]/, config.authorization['auth-client-id']);

			fetch(
				url, {
					method: 'get',
					headers: {
						authorization : 'Bearer ' + req.session.userAccessToken,
					},
					mode: 'cors',
				})
				.then(
					response => response.json(),
					error => { return next(new Error('User niet bekend')); }
				)
				.then(
					json => {
						req.userData = json;
						return next()
					}
				)
				.catch(err => {
				//	console.log('DEV GET USER CATCH ERROR');
					// console.log(err);
					next(err);
				})
		})
		.get(function( req, res ) {
			if (req.userData && req.userData.user_id) {
				db.BudgetVote
					.destroy({where:  {userId: req.userData.user_id }, force: true})
					.then(result => {
						res.header('Set-Cookie', 'openstad-error=; Path=/');
						res.success('/begroten', true);
					})
			} else {
				res.success('/begroten', true);
			}
		});

	// is er iemand die dit gebruikt? dan moet het herschreven naar een nieuwe manier van werken
	// router.get('/email/:page', function( req, res, next ) {
	//   var fs       = require('fs');
	//   var nunjucks = require('nunjucks');
  //  
	//   var data     = {
	//   	complete : 'complete' in req.query,
	//   	date     : new Date(),
	//   	token    : 'temp',
	//   	userId   : req.user.id,
	//   	ref      : req.query.ref,
	//   	assets   : {
	//   		arg: [{
	//   			instance: {
	//   				user        : {nickName: 'Daan Mortier'},
	//   				updatedAt   : new Date(),
	//   				label       : 'A',
	//   				description :
	//   					`Dit is een test argument.`
	//   			}
	//   		}, {
	//   			instance: {
	//   				user        : {nickName: 'Michael de Paikel'},
	//   				updatedAt   : new Date(),
	//   				label       : 'B',
	//   				description :
	//   					`En dit is nogmaals een test argument met iets meer
	//   					inhoud dan het vorige bericht. Op deze manier is beter
	//   					te zien hoe de layout zich om de tekst vormt.`
	//   			}
	//   		}]
	//   	}
	//   };
	//   var content  = nunjucks.render('email/'+req.params.page+'.njk', data);
  //  
	//   if( 'send' in req.query ) {
	//   	mail.sendMail({
	//   		to          : 'tjoekbezoer@gmail.com',
	//   		subject     : 'Bedankt voor je voorstel',
	//   		html        : content,
	//   		// text        : nunjucks.render('email/login_link_text.njk', data),
	//   		attachments : [{
	//   			filename : 'logo@2x.png',
	//   			path     : 'img/email/logo@2x.png',
	//   			cid      : 'logo'
	//   		}, {
	//   			filename : 'map@2x.png',
	//   			path     : 'img/email/map@2x.png',
	//   			cid      : 'map'
	//   		}, {
	//   			filename : 'steps@2x.png',
	//   			path     : 'img/email/steps@2x.png',
	//   			cid      : 'steps'
	//   		}]
	//   	});
	//   }
  //  
	//   res.send(content);
	// });

	// old
	 //router.get('/send_notifications', function( req, res, next ) {
	 // 	var notifications = require('../notifications');
	 // 	notifications.publications.forEach(function( pub ) {
	 // 		pub.processQueue();
	 // 	});
	 // 	res.send('Done');
	 //});
}
