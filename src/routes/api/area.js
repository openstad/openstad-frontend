const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const convertDbPolygonToLatLng = require('../../util/convert-db-polygon-to-lat-lng');

const router = require('express-promise-router')({ mergeParams: true });

// scopes: for all get requests
router
  .all('*', function(req, res, next) {
    req.scope = ['api'];

    req.scope.push('includeSite');

    return next();
  })

router.route('/')
  .get(auth.can('Area', 'list'))
  .get(pagination.init)
  .get(function(req, res, next) {
    return db.Area
      .findAndCountAll({ offset: req.pagination.offset, limit: req.pagination.limit })
      .then(function(result) {
        req.areas = result.rows || [];
        return next();
      })
      .catch(next);
  })
  .get(function(req, res, next) {
    req.areas = req.areas.map((area) => {
      area.polygon = convertDbPolygonToLatLng(area.polygon);
      return area;
    });

    return next();
  })
  .get(function(req, res, next) {
    res.json(req.areas);
  })

  // Persist an area
  .get(auth.can('Area', 'create'))
  .post(function(req, res, next) {
    if (!req.body.name) return next(createError(401, 'Geen naam opgegeven'));
    if (!req.body.polygon) return next(createError(401, 'Geen polygoon opgegeven'));
    return next();
  })
  .post(function(req, res, next) {
    db.Area
      .create(req.body)
      .catch(next)
      .then(function(result) {
        res.json({ success: true, id: result.id });
      });
  })

router.route('/:areaId(\\d+)')
  .all(function(req, res, next) {
    var areaId = parseInt(req.params.areaId) || 1;

    db.Area
      .findOne({
        where: { id: areaId, siteId: req.params.siteId }
      })
      .then(found => {
        if ( !found ) throw new Error('area not found');

        req.area = found;
        req.results = req.area;
        next();
      })
      .catch((err) => {
        console.log('errr', err)
        next(err);
      });
  })

  // view area
  // ---------
  .get(auth.can('area', 'view'))
  .get(auth.useReqUser)
  .get(function(req, res, next) {
    res.json(req.results);
  })

  // update area
  // -----------
  .put(auth.useReqUser)
  .put(function(req, res, next) {
    req.tags = req.body.tags;
    return next()
  })
  .put(function(req, res, next) {

    var area = req.results;
    if (!( area && area.can && area.can('update') )) return next( new Error('You cannot update this area') );

    let data = {
      ...req.body,
    }

    // TODO: dit moet ook nog ergens in auth
    if (auth.hasRole(req.user, 'editor')) {
      if (data.modBreak) {
        data.modBreakUserId = req.body.modBreakUserId = req.user.id;
        data.modBreakDate = req.body.modBreakDate = new Date().toString();
      } else {
        data.modBreak = '';
        data.modBreakUserId = null;
        data.modBreakDate = null;
      }
    }

    area
      .authorizeData(data, 'update')
      .update(data)
      .then(result => {
        req.results = result;
        next()
      })
      .catch(next);
  })
  .put(function(req, res, next) {
    let areaInstance = req.results;

    areaInstance
      .then(areaInstance => {
        return db.Area
          .findOne({
            where: { id: areaInstance.id, siteId: req.params.siteId }
          })
          .then(found => {
            if ( !found ) throw new Error('area not found');
            req.results = found;
            next();
          })
          .catch(next);
      })

  })
  .put(function(req, res, next) {
    res.json(req.results);
  })

  // delete area
  // ---------
  .delete(auth.can('area', 'delete'))
  .delete(function(req, res, next) {
    req.results
      .destroy()
      .then(() => {
        res.json({ "area": "deleted" });
      })
      .catch(next);
  })

module.exports = router;
