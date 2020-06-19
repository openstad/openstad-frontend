const db = require('../../db');
const auth = require('../../middleware/sequelize-authorization-middleware');
const pagination = require('../../middleware/pagination');
const convertDbPolygonToLatLng = require('../../util/convert-db-polygon-to-lat-lng');

const router = require('express-promise-router')({ mergeParams: true });

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

  // update area
  // -----------
  .delete(auth.can('area:create'))
  .put(function(req, res, next) {

    const user = req.results;
    if (!( user && user.can && user.can('update') )) return next( new Error('You cannot update this User') );

    // todo: dit was de filterbody function, en dat kan nu via de auth functies, maar die is nog instance based
    let data = {}

    const keys = [ 'firstName', 'lastName', 'email', 'phoneNumber', 'streetName', 'houseNumber', 'city', 'suffix', 'postcode'];
    keys.forEach((key) => {
      if (req.body[key]) {
        data[key] = req.body[key];
      }
    });

    const userId = parseInt(req.params.userId) || 1;

    /**
     * Update the user API first
     */
    let which = req.query.useOauth || 'default';
    let siteOauthConfig = ( req.site && req.site.config && req.site.config.oauth && req.site.config.oauth[which] ) || {};
    let authServerUrl = siteOauthConfig['auth-server-url'] || config.authorization['auth-server-url'];
    let authUpdateUrl = authServerUrl + '/api/admin/user/' + req.results.externalUserId;
    let authClientId = siteOauthConfig['auth-client-id'] || config.authorization['auth-client-id'];
    let authClientSecret = siteOauthConfig['auth-client-secret'] || config.authorization['auth-client-secret'];

    const apiCredentials = {
      client_id: authClientId,
      client_secret: authClientSecret,
    }
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(Object.assign(apiCredentials, data))
    }

    fetch(authUpdateUrl, options)
      .then((response) => {
        if (response.ok) {
          return response.json()
        }

        throw createError('Updaten niet gelukt', response);
      })
      .then((json) => {
        //update values from API
        return db.User
          .authorizeData(data, 'update')
          .update(data, {where : { externalUserId: json.id }});
      })
      .then( (result) => {
        return db.User
          .findOne({
            where: { id: userId, siteId: req.params.siteId }
            //where: { id: parseInt(req.params.userId) }
          })
      })
      .then(found => {
        if ( !found ) throw new Error('User not found');
        res.json(found);
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
  })

  // delete area
  // ---------
  .delete(auth.can('area:delete'))
  .delete(function(req, res, next) {
    req.results
      .destroy()
      .then(() => {
        res.json({ 'area': 'deleted' });
      })
      .catch(next);
  });

module.exports = router;
