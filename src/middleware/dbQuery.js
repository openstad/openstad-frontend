module.exports = function( req, res, next ) {
  req.dbQuery = {};
  req.queryConditions = req.queryConditions || {};

  next();
}
