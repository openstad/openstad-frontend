var moment = require('moment');
//var nlib   = require('nunjucks/src/lib');
var slice  = Array.prototype.slice;

// Is set via `setDefaultFormat`.
var defaultFormat = 'Do MMMM, YYYY';

moment.locale('nl');

// Examples:
// {{ var | date }}
// {{ var | date('YYYY-MM-DD') }}
function dateFilter( date, format ) {
	try {
		if( !date ) {
			throw Error('Onbekende datum');
		}
		// Timezone is set in `config/moment.js`.
		//

		var mom = moment(date);
		return mom.format(format || defaultFormat);
	} catch( error ) {
		return (error.message || 'dateFilter error').toString()
	}
}

// Set default format for date.
dateFilter.setDefaultFormat = function( format ) {
	defaultFormat = format;
};

exports.format = dateFilter;
