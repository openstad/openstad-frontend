module.exports = function( app ) {
	app.get('/accepteer-cookies', function( req, res, next ) {
		res.acceptCookies();
		res.redirect(req.get('Referer') || '/');
	});
};
