var log           = require('debug')('app:cron');
var notifications = require('../notifications');

// Purpose
// -------
// Send notifications emails.
// 
// Runs every 5 minutes on the 15th second, because the close_ideas
// cron already runs on the 0th second.
module.exports = {
	//cronTime: '*/5 * * * * *',
	cronTime: '20 */5 * * * *',
	runOnInit: false,
	onTick: function() {
		notifications.processQueue('idea');
	}
};
