const config = require('config');

module.exports = function( req, res, next ) {

	let url = req.headers && req.headers.origin;
	if ( !config.allowedOrigins || !config.allowedOrigins.find( elem => elem == url ))
		url = config.url || req.protocol + '://' + req.hostname;
		
  // res.header('Access-Control-Allow-Origin', url );
  res.header('Access-Control-Allow-Origin', '*' );
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-http-method-override, X-GRIP-Tenant-Id, X-Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

	if (req.method == 'OPTIONS') {
		return res.end();
	}

	return next();

}
