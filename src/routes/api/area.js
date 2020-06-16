const db              = require('../../db');
const auth 				   = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const convertDbPolygonToLatLng = require('../../util/convert-db-polygon-to-lat-lng');

const router = require('express-promise-router')({mergeParams: true});

router.route('/')
  .get(auth.can('Area', 'list'))
  .get(pagination.init)
  .get(function (req, res, next) {
    return db.Area
      .findAndCountAll({ offset: req.pagination.offset, limit: req.pagination.limit })
      .then(function (result) {
        req.areas = result.rows || [];
        return next();
      })
      .catch(next)
  })
  .get(function (req, res, next) {
    req.areas = req.areas.map((area) => {
      area.polygon = convertDbPolygonToLatLng(area.polygon);
      return area;
    })

    return next();
  })
  .get(function (req, res, next) {
    res.json(req.areas)
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
      .then(function (result) {
        res.json({success: true, id: result.id});
      })
	});

module.exports = router;
