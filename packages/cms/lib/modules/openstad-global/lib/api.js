const polygons          = require('../../../../config/map').default.polygons;
var _ = require('lodash');
const eventEmitter = require('../../../../events').emitter;

module.exports = (self, options) => {

    self.setSyncFields = () => {
        self.apiSyncFields = self.apos.openstadApi.getApiSyncFields(options.addFields);
    };

    // Overriding requirePieceEditorView to sync global field values with api.
    self.requirePieceEditorView = function(req, res, next) {
        const id = self.apos.launder.id(req.body._id);

        if (!self.apos.permissions.can(req, 'edit-' + self.name)) {
            return self.apiResponse(res, 'forbidden');
        }

        return self.findForEditing(req, { _id: id })
          .toObject(function(err, _piece) {
              if (err) {
                  return self.apiResponse(res, err);
              }
              if (!_piece) {
                  return self.apiResponse(res, 'notfound');
              }

              // Todo: deserialize formatting fields to get values from the api?

              req.piece = self.apos.openstadApi.syncApiFields(_piece, self.apiSyncFields, req.data.global.siteConfig, req.data.global.workflowLocale);

              return next();
          });
    };


    self.formatGlobalFields = (req, doc, options) => {
  //    console.log('req', req)
      // for some reason apos calls this with empty req object on start, this will cause formatting issues so skip in that case
      if (!req.headers) {
        return;
      }

      self.schema.forEach((field, i) => {
        if (field.formatField) {
          //doc is the doc for saving in mongodb, in this case it's the global values
          doc[field.name] = field.formatField(field, self.apos, doc, req);
        }

      });
    };

    self.syncApi = async (req, doc, options) => {
        // Avoid syncing api when it's a default-draft save from workflow
        if(doc.type !== 'apostrophe-global' || (doc.workflowLocale && doc.workflowLocale === 'default-draft')) {
            return;
        }

        if (req.data.global) {
          try {
              await self.apos.openstadApi.updateSiteConfig(req, req.data.global.siteConfig, doc, self.apiSyncFields);
          } catch(err) {
              console.error(err);
          }
        }
    };

    self.clearCache =  (req, doc, options) => {
        eventEmitter.emit('clearCache');
    }

    self.overrideGlobalDataWithSiteConfig = (req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

      // Take default site ID, possible to overwritten
      if (!req.data.global.siteId) {
        req.data.global.siteId = siteConfig.id;
      }

      // empty
    //  req.data.global.siteTitle = '';

      req.data.global.siteConfigTitle = siteConfig.title;

    //  req.data.global.siteConfig = siteConfig;
      req.data.originalUrl = req.originalUrl;

      //add query tot data object, so it can be used
      req.data.query = req.query;

      //
      if (siteConfig && siteConfig.area && siteConfig.area.polygon) {
        req.data.global.mapPolygons =  siteConfig && siteConfig.area && siteConfig.area.polygon || '';
      }

      // Todo: remove this fallback when every site use the areaId from the api.
      // This is the fallback for old sites, polygons were hardcoded in the site
      if (req.data.global.mapPolygons === '' && req.data.global.mapPolygonsKey) {
        req.data.global.mapPolygons = polygons[req.data.global.mapPolygonsKey];
      }

      next();
    };

    self.loadPolygonsFromApi = async function (addPolygonData) {
      try {
        const areas = await self.apos.openstadApi.getAllPolygons();

        if (areas) {
          return [{label: 'Geen', value: ''}].concat(areas.map((area) => {

            const data = {
              label: area.name,
              value: area.id
            }

            if (addPolygonData) {
              data.polygon = area.polygon;
            }

            return data;
          }))
        }
        throw new Error('No polygons found');
      } catch (error) {
        // @todo: proper error handling
        return [];
      }
    }

};
