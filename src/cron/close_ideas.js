var Sequelize = require('sequelize');
var log = require('debug')('app:cron');
var db  = require('../db');

// Purpose
// -------
// Auto-close ideas that passed the deadline.
// 
// Runs every 5 minutes.
module.exports = {
	cronTime: '0 */5 * * * *',
	runOnInit: true,
	onTick: function() {
		db.Idea.scope('withVoteCount').findAll({
			where: {
				endDate : {[Sequelize.Op.lte]: new Date()},
				status  : 'OPEN'
			}
		})
		.then(function( ideas ) {
			for( let idea of ideas ) {
				idea.setStatus('CLOSED').then(function() {
					switch( idea.status ) {
						case 'CLOSED':
							log('Automatically closed idea %d', idea.id);
							break;
					}
				});
			}
		});
	}
};
