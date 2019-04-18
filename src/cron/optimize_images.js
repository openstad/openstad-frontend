var log = require('debug')('app:cron');
var db  = require('../db');

// Purpose
// -------
// Delete user-uploaded images older than 7 days that are not linked
// to an existing idea.
// 
// Runs every minute
module.exports = {
	cronTime: '50 1 * * * *',
	// cronTime: '50 * * * * *',
  onTick: function() {
		// db.sequelize.query(`
		//   DELETE FROM
		//   	images
		//   WHERE
		//   	ideaId IS NULL AND
		//   	articleId IS NULL AND
		//   	DATEDIFF(UTC_TIMESTAMP(), createdAt) > 7
		// `).spread(function( result, metaData ) {
		//   log('Removed orphaned images: %d', metaData.affectedRows);
		// });
	}
};
