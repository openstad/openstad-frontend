const polygons          = require('../../../../config/map').default.polygons;

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

              req.piece = self.apos.openstadApi.syncApiFields(_piece, self.apiSyncFields, req.data.global.siteConfig, req.data.global.workflowLocale);

              return next();
          });
    };

    self.syncApi = async (req, doc, options) => {
        // Avoid syncing api when it's a default-draft save from workflow
        if(doc.type !== 'apostrophe-global' || (doc.workflowLocale && doc.workflowLocale === 'default-draft')) {
            return;
        }

        try {
            await self.apos.openstadApi.updateSiteConfig(req, req.data.global.siteConfig, doc, self.apiSyncFields);
        } catch(err) {
            console.error(err);
        }
    };

    self.overrideGlobalDataWithSiteConfig = (req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
      // Take default site ID, possible to overwritten
      if (!req.data.global.siteId) {
        req.data.global.siteId = siteConfig.id;
      }

      req.data.global.siteTitle = 'overwrite title in editor';

      req.data.global.siteConfig = siteConfig;
      req.data.originalUrl = req.originalUrl;

      //add query tot data object, so it can be used
      req.data.query = req.query;

      req.data.global.mapPolygons = (siteConfig && siteConfig.area && siteConfig.area.polygon) || '';

      // add the polygon object to the global data object
      // Todo: remove fallback when every site use the areaId from the api.
      if (req.data.global.mapPolygons === '' && req.data.global.mapPolygonsKey) {
        req.data.global.mapPolygons = polygons[req.data.global.mapPolygonsKey];
      }

      next();
    };

};
