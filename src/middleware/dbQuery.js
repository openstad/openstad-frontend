
module.exports = function( req, res, next ) {
  req.dbQuery = {};

  next();
}
