const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const searchResults = require('../../middleware/search-results-static');
const convertDbPolygonToLatLng = require('../../util/convert-db-polygon-to-lat-lng');
const {formatGeoJsonToPolygon} = require('../../util/geo-json-formatter');

const router = require('express-promise-router')({ mergeParams: true });
var createError = require('http-errors');

// scopes: for all get requests
router
  .all('*', function(req, res, next) {
    req.scope = ['api'];
    req.scope.push('includeSite');
    return next();
  });

router.route('/')
  .get(auth.can('Area', 'list'))
  .get(pagination.init)
  .get(function(req, res, next) {
    let { dbQuery } = req;

    return db.Area
      .findAndCountAll(dbQuery)
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

  // Persist an area
  .post(auth.can('Area', 'create'))
  .post(function(req, res, next) {
    // if geodata is set transform to polygon format this api expects
    if (req.body.geoJSON) {
      req.body.polygon = formatGeoJsonToPolygon(req.body.geoJSON);
    }

    next();
  })
  .post(function(req, res, next) {
    if (!req.body.name) return next(createError(401, 'Geen naam opgegeven'));
    if (!req.body.polygon) return next(createError(401, 'Geen polygoon opgegeven'));
    return next();
  })
  .post(function(req, res, next) {
    db.Area
      .create(req.body)
      .catch((err) => {
        console.log('errr', err);
        next(err);
      })
      .then(function(result) {
        res.json({ success: true, id: result.id });
      });
  });

router.route('/:areaId(\\d+)')
  .all(function(req, res, next) {
    var areaId = parseInt(req.params.areaId) || 1;

    db.Area
      .findOne({
        // where: { id: areaId, siteId: req.params.siteId }
        where: { id: areaId },
      })
      .then(found => {
        if (!found) throw new Error('area not found');

        req.area = found;
        req.results = req.area;
        next();
      })
      .catch((err) => {
        console.log('errr', err);
        next(err);
      });
  })

  // view area
  // ---------
  // .get(auth.can('area', 'view'))
  .get(auth.useReqUser)
  .get(function(req, res, next) {
    res.json(req.results);
  })
  .put(function(req, res, next) {
    if (req.body.geoJSON) {
      req.body.polygon =  formatGeoJsonToPolygon(req.body.geoJSON);
    }

    next();
  })
  .put(auth.useReqUser)
  .put(function(req, res, next) {
    const area = req.results;

    if (!( area && area.can && area.can('update') )) return next( new Error('You cannot update this area') );

    area
      .authorizeData(area, 'update')
      .update({
        ...req.body,
      })
      .then(result => {
        req.results = result;
        next();
      })
      .catch(next);
  })
  .put(function(req, res, next) {
    let areaInstance = req.results;

    return db.Area
      .findOne({
        where: { id: areaInstance.id },
        // where: { id: areaInstance.id, siteId: req.params.siteId },
      })
      .then(found => {
        if (!found) throw new Error('area not found');
        req.results = found;
        next();
      })
      .catch(next);

  })
  .put(function(req, res, next) {
    res.json(req.results);
  })

  // delete area
  // ---------
  // .delete(auth.can('area', 'delete'))
  .delete(auth.useReqUser)
  .delete(function(req, res, next) {
    const result = req.results;

    if (!(result && result.can && result.can('delete'))) return next(new Error('You cannot delete this area'));

    req.results
      .destroy()
      .then(() => {
        res.json({ 'area': 'deleted' });
      })
      .catch(next);
  });

module.exports = router;
