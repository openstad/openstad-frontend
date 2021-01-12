const isJson = require('../util/isJson');

module.exports = function( req, res, next ) {
  const sort = req.query.sort;

  if(sort && isJson(sort)) {
    req.dbQuery.order = [JSON.parse(sort)];
  }

  next();
}
