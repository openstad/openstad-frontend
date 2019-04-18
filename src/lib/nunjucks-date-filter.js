var moment = require('moment-timezone');
var nlib   = require('nunjucks/src/lib');
var slice  = Array.prototype.slice;

// Is set via `setDefaultFormat`.
var defaultFormat = null;

// Examples:
// {{ var | date }}
// {{ var | date('YYYY-MM-DD') }}
function dateFilter( date, format ) {
	try {
		if( !date ) {
			throw Error('Onbekende datum');
		} else if( date === 'now' || date === 'today' ) {
			date = new Date();
		}
		// Timezone is set in `config/moment.js`.
		var mom = moment(date);
		return nlib.isFunction(mom[format]) ?
		       mom[format].apply(mom, slice.call(arguments, 2)) :
		       mom.format(format || defaultFormat);
	} catch( error ) {
		return (error.message || 'dateFilter error').toString()
	}
}

// Set default format for date.
dateFilter.setDefaultFormat = function( format ) {
	defaultFormat = format;
};

module.exports = dateFilter;