var log = require('debug')('app:cron');
var db  = require('../db');

// Purpose
// -------
// Randomize the running ideas' sort field.
// 
// Runs every day at midnight.
module.exports = {
	cronTime: '0 0 0 * * *',
	// runOnInit: true,
	onTick: function() {
		return db.Idea.getRunning()
		.then(function( ideas ) {
			var sort = sequence(1, ideas.length);
			ideas.forEach(function( idea, i ) {
				idea.update({sort: sort[i]});
			});
			log('Changed idea sort order');
		});
	}
};

function sequence( from, to ) {
	var min  = Math.min(from, to);
	var max  = Math.max(from, to);
	var len  = max - min + 1;
	var orig = Array(len);
	for( var i=0; i<len; i++ ) {
		orig[i] = from++;
	}
	
	var result = Array();
	while( orig.length ) {
		var i  = Math.floor(Math.random() * orig.length);
		result.push(orig.splice(i, 1)[0]);
	}
	
	return result;
}