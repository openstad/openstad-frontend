var config = require('config');
var moment = require('moment-timezone');

moment.tz.setDefault(config.get('timeZone'));
// TODO: Set this per request based on accept-language header or
//       logged in user preference?
moment.locale(config.get('locale'));
// The custom nunjuck filter `duration` uses moment's `humanize` to
// display the remaining time. This threshold configures `humanize`
// behavior.
// Only print <= 5 seconds as 'a few seconds' instead of the entire
// last minute.
moment.relativeTimeThreshold('ss', 5);
// Always print idea duration in days, not months.
moment.relativeTimeThreshold('d', config.get('ideas.duration')+1);