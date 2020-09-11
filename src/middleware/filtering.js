const isJson = require('../util/isJson');

module.exports = function(req, res, next) {
  let { filter } = req.query;
  filter = filter && isJson(filter) ? JSON.parse(filter) : false;

  if (filter && Object.keys(filter).length > 0) {
    req.dbQuery.where = filter;
  }

  next();
};
