var ary           = require('lodash/ary');
var config        = require('config');
var Promise       = require('bluebird');
var mail          = require('../lib/mail');
var MemoryStore   = require('./MemoryStore');
var Notifications = require('./Notifications');
var Publication   = Notifications.Publication;

var notifications = new Notifications();

// Setup high-frequency admin email notifications.
notifications.addPublication(new Publication('admin_idea', new MemoryStore(), {
	assets: {
		'idea': [{
			events    : ['create', 'update'],
			frequency : 600 // 10 minutes
		}]
	},
	sendMessage: createSendMessageFunction()
}));

notifications.addPublication(new Publication('admin_arg', new MemoryStore(), {
	assets: {
		'arg': [{
			events    : ['create', 'update'],
			// frequency : 86400 // 24 hours
			frequency : 600 // 10 minutes
		}]
	},
	sendMessage: createSendMessageFunction()
}));

function createSendMessageFunction( subject ) {
	return function sendMessage( user ) {

		// HACK: The current file is included in some model definition
		//       files, so including db at the top of this files results
		//       in an empty object.
		var db = require('../db');

		if( user.id != 0 ) {
			throw Error('Only user 0 can be subscribed to this publication');
		}
		
		var queries = [];
		var assets  = user.assets;
		var data    = {
			date   : new Date(),
			assets : {}
		};

		// Gather data
		// -----------
		// Turn maps and sets into POJOs and arrays, get the relevant model instances
		// so they can be used by to render the email content.
		assets.forEach(function( instances, assetName ) {
			var Model = assetName == 'idea' ? db.Idea.scope('withUser', 'withPosterImage') :
				  assetName == 'arg'  ? db.Argument :
				  null;
			var rows  = data.assets[assetName] = [];
			
			instances.forEach(function( actions, instanceId ) {

				var row = {
					instance : undefined,
					action   : actions.has('create') ?
						'created' :
						'updated'
				};

				var query = Model.findByPk(instanceId).then(function( instance ) {
					row.instance = instance;
				});
				
				rows.push(row);
				queries.push(query);

			});
		});
		
		// When all data is fetched, render email and send it off.
		return Promise.all(queries)
			.then(function() {
				mail.sendNotificationMail(data);
				return null;
			});
	}
}

module.exports = notifications;
