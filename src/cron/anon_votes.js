var Promise = require('bluebird');

var log     = require('debug')('app:cron');
var db      = require('../db');

// Purpose
// -------
// Auto-close ideas that passed the deadline.
// 
// Runs every night at 4:00.
module.exports = {
	cronTime: '0 0 4 * * *',
	runOnInit: true,
	onTick: function() {
		Promise.all([
			db.Vote.anonimizeOldVotes(),
			db.ArgumentVote.anonimizeOldVotes()
		])
		.spread(function( voteResult, argVoteResult ) {
			if( voteResult && voteResult.affectedRows ) {
				log(`anonimized votes: ${voteResult.affectedRows}`);
			}
			if( argVoteResult && argVoteResult.affectedRows ) {
				log(`anonimized argument votes: ${argVoteResult.affectedRows}`);
			}
		});
	}
};
