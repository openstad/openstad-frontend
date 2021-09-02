const db = require('../db');
const createError = require('http-errors');

const getSiteId = (path) => {
  const match = path.match(/\/site\/(\d+)?\//);
  if (match) {
      return parseInt(match[1]);
  }

  return null;
}

module.exports = function( req, res, next ) {

  // @todo: inverse this middleware; Only apply it on routes that need it, instead of applying this middleware to every route and then creating exceptions for routes that don't need it
  // deze paden mogen dit overslaan
  if (req.path.match('^(/doc|/dev|/accepteer-cookies|/api/repo|/api/area|/$)')) return next();
  if (req.path.match('^(/api/site(/[^/]*)?)$')) return next();

  const siteId = getSiteId(req.path);
  if (!siteId || typeof siteId !== 'number') return next(new createError('400', 'Site niet gevonden for path: ' + req.path));

  const where = { id: siteId }

  return db.Site
  	.findOne({ where })
  	.then(function( found ) {
      if (!found) {
        console.log('Site not found for siteId query: ', where);
        return next(new createError('404', 'Site niet gevonden for siteId: '+ siteId));
      }
  		req.site = found;
  		next();
      return null;
  	})
  	.catch( err => {
  		next(err)
      return null;
  	});
}
