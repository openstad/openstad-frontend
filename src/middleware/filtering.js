const isJson = require('../util/isJson');

module.exports = function(req, res, next) {
  const { filter } = req.query;

  if (filter && isJson(filter)) {
    req.dbQuery.where = [JSON.parse(filter)];
  }

  next();
};
