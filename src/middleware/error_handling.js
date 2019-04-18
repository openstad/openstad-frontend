var createError = require('http-errors');
var statuses    = require('statuses');

module.exports = function( app ) {
	// ---
	// Sentry error reporting is added in `Server.js`, because it requires
	// 2 middleware installations; one is the very first middleware, the
	// second one is the error reporter which should actually be located here.
	// To remain DRY, these two middlewares are installed in the same place.
	// ---
	
	// We only get here when the request has not yet been handled by a route.
	app.use(function( req, res, next ) {
		next(createError(404, 'Pagina niet gevonden'));
	});
	
	app.use(function handleError( err, req, res, next ) {
		var env            = app.get('env');
		var status         = err.status || 500;
		var userIsAdmin    = req.user && req.user.isAdmin();
		var showDebug      = status == 500 && (env === 'development' || userIsAdmin);
		var friendlyStatus = statuses[status]
		var stack          = err.stack || err.toString();
		var message        = err.message;
		var errorStack     = showDebug ? stack : '';
		
		if( env !== 'test' && status == 500 ) {
			console.error(stack);
		}
		
		res.status(status);
		if( res.out ) {
			res.out('error', true, {
				status         : status,
				friendlyStatus : friendlyStatus,
				message        : message,
				errorStack     : errorStack.replace(/\x20{2}/g, ' &nbsp;'),
				error          : err
			});
		} else {
			res.send(`<h1>${friendlyStatus}</h1><p>${message}</p>`);
		}
	});
};
