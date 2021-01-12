var log           = require('debug')('app:cron');
var notifications = require('../notifications');

// Purpose
// -------
// Send notifications emails.

module.exports = {
	//cronTime: '*/5 * * * * *',
	cronTime: '20 */5 * * * *',
	runOnInit: false,
	onTick: function() {
		notifications.processQueue('article');
	}
};
