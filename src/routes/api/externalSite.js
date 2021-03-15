const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results-static');

const router = require('express-promise-router')({ mergeParams: true });
var createError = require('http-errors');


router.route('/')
  .get(auth.can('ExternalSite', 'list'))
  .get(pagination.init)
  .get(function(req, res, next) {
    return db.ExternalSite
      .findAndCountAll({offset: req.dbQuery.offset, limit: req.dbQuery.limit})
      .then(function(result) {
        req.results = result.rows || [];
        req.dbQuery.count = result.count;
        return next();
      })
      .catch(next);
  })
  .get(searchResults)
  .get(pagination.paginateResults)
  .get(function(req, res, next) {
    res.json(req.results);
  })

module.exports = router;
