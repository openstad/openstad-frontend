// How to use
// ----------
// When specifying your cron frequency you'll need to make sure that your
// values fall within the ranges:
//  - Seconds: 0-59
//  - Minutes: 0-59
//  - Hours: 0-23
//  - Day of Month: 1-31
//  - Months: 0-11
//  - Day of Week: 0-6
//
// Example
// -------
// This example file is not included in the actual application, because
// `./src/Cron.js` uses `invokeDir` to include all cron job definitions
// which ignores `index.js`.
module.exports = {
	cronTime: '* * * * * *',
	onTick: function() {
		this.stop();
	},
	onComplete: function() {
		console.log('Job done');
	}
}
