// ----------------------------------------------------------------------------------------------------
// filter data on user roles
// ----------------------------------------------------------------------------------------------------

const config = require('config');

module.exports = function toAuthorizedJSON( req, res, next ) {
  let model = req.results;
  if (Array.isArray(req.results)) {
    req.results = req.results.map( result => result.toAuthorizedJSON(req.user) );
  } else {
    req.results = req.results.toAuthorizedJSON(req.user)
  }
  next();

}
