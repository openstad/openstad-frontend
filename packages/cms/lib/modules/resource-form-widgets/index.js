const resourcesSchema = require('../../../config/resources.js').schemaFormat;
const openstadMap = require('../../../config/map').default;

const fields = require('./lib/fields.js');

module.exports = {
  extend: 'map-widgets',
  label: 'Resource form',
  addFields: fields,
  playerData: ['mapConfig', 'resourceImages'],
  beforeConstruct: function (self, options) {

    if (options.resources) {
      self.resources = options.resources;

      options.addFields = [
        {
          type: 'select',
          name: 'resource',
          label: 'Resource (from config)',
          choices: options.resources
        }
      ].concat(options.addFields || [])
    }
  },
  construct: function (self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([

      {
        name: 'general',
        label: 'Algemeen',
        fields: ['resource', 'redirect', 'formType', 'dynamicFormSections']
      },
      {
        name: 'title',
        label: 'Title',
        fields: ['labelTitle', 'infoTitle', 'requiredTitle', 'minTitle', 'maxTitle']
      },
      {
        name: 'summary',
        label: 'Summary',
        fields: ['labelSummary', 'infoSummary', 'requiredSummary', 'typeSummary', 'minSummary', 'maxSummary']
      },
      {
        name: 'description',
        label: 'Description',
        fields: ['labelDescription', 'infoDescription', 'editorDescription', 'requiredDescription', 'minDescription', 'maxDescription']
      },
      {
        name: 'images',
        label: 'Images Upload',
        fields: ['labelImages', 'infoImages', 'uploadMultiple', 'requiredImages']
      },
      {
        name: 'themes',
        label: 'Themes',
        fields: ['labelThemes', 'infoThemes', 'requiredThemes']
      },
      {
        name: 'areas',
        label: 'Areas',
        fields: ['labelAreas', 'infoAreas', 'requiredAreas']
      },
      {
        name: 'location',
        label: 'Location',
        fields: ['labelLocation', 'infoLocation', 'displayLocation', 'requiredLocation']
      },
      {
        name: 'Estimate',
        label: 'Estimate costs',
        fields: ['labelEstimate', 'infoEstimate', 'displayEstimate', 'requiredEstimate', 'typeEstimate', 'minEstimate', 'maxEstimate']
      },
      {
        name: 'Role',
        label: 'Role',
        fields: ['labelRole', 'infoRole', 'displayRole', 'requiredRole', 'typeRole', 'minRole', 'maxRole']
      },
      {
        name: 'Phone',
        label: 'Phone number',
        fields: ['labelPhone', 'infoPhone', 'displayPhone', 'requiredPhone', 'minPhone', 'maxPhone']
      },
      {
        name: 'advice',
        label: 'Tip',
        fields: ['labelAdvice', 'infoAdvice', 'displayAdvice', 'requiredAdvice', 'minAdvice', 'maxAdvice']
      },
      {
        name: 'submitting',
        label: 'Submitting',
        fields: ['buttonTextSubmit', 'buttonTextSave']
      },
      {
        name: 'budget',
        label: 'Budget',
        fields: ['displayBudget']
      }

    ]);

    require('./lib/submit.js')(self, options);

    /** add config **/
    const superLoad = self.load;

    self.load = function(req, widgets, next) {
        const styles = openstadMap.defaults.styles;
        const globalData = req.data.global;

	      widgets.forEach((widget) => {
            const resourceType = widget.resource ?  widget.resource : false;
            const resourceInfo = resourceType  ? resourcesSchema.find((resourceInfo) => resourceInfo.value === resourceType) : false;

            if (!resourceInfo) {
              return;
            }

            const resourceConfigKey = resourceInfo ? resourceInfo.configKey : false;
            const resourceConfig = req.data.global.siteConfig && req.data.global.siteConfig[resourceConfigKey] ? req.data.global.siteConfig[resourceConfigKey] : {};

	          const siteConfig = req.data.global.siteConfig;

            widget.resourceConfig = {
              titleMinLength: ( resourceConfig.titleMinLength ) || 10,
              titleMaxLength: ( resourceConfig.titleMaxLength ) || 50,
              summaryMinLength: ( resourceConfig.summaryMinLength ) || 20,
              summaryMaxLength: ( resourceConfig.summaryMaxLength ) || 140,
              descriptionMinLength: ( resourceConfig.descriptionMinLength ) || 140,
              descriptionMaxLength: ( resourceConfig.descriptionMaxLength ) || 5000,
            }

            widget.resourceEndPoint = resourceInfo.resourceEndPoint;

    				widget.siteConfig = {
    					openstadMap: {
    						polygon: ( siteConfig && siteConfig.openstadMap && siteConfig.openstadMap.polygon ) || undefined,
    					},
    				}

    				const markerStyle = siteConfig.openStadMap && siteConfig.openStadMap.markerStyle ? siteConfig.openStadMap.markerStyle : null;

            // Todo: refactor this to get resourceId in a different way
    				const activeResource = req.data.activeResource;
    				const resources = activeResource ? [activeResource] : [];
            const googleMapsApiKey = self.apos.settings.getOption(req, 'googleMapsApiKey');

            widget.mapConfig = self.getMapConfigBuilder(globalData)
                .setDefaultSettings({
                    mapCenterLat: (activeResource && activeResource.location && activeResource.location.coordinates && activeResource.location.coordinates[0]) || globalData.mapCenterLat,
                    mapCenterLng: (activeResource && activeResource.location && activeResource.location.coordinates && activeResource.location.coordinates[1]) || globalData.mapCenterLng,
                    mapZoomLevel: 16,
                    zoomControl: true,
                    disableDefaultUI : true,
                    styles: styles,
                    googleMapsApiKey: googleMapsApiKey,
                    useMarkerLinks: false
                })
                .setMarkerStyle(markerStyle)
                .setEditorMarker()
                .setEditorMarkerElement('locationField')
                .setPolygon(req.data.global.mapPolygons || null)
                .getConfig();

  		});

			superLoad(req, widgets, next);
		}



  const superPushAssets = self.pushAssets;
   self.pushAssets = function () {
     superPushAssets();
     self.pushAsset('stylesheet', 'filepond', { when: 'always' });
     self.pushAsset('stylesheet', 'trix', { when: 'always' });
     self.pushAsset('stylesheet', 'form', { when: 'always' });
     self.pushAsset('stylesheet', 'main', { when: 'always' });
     self.pushAsset('script', 'map', { when: 'always' });
     self.pushAsset('script', 'editor', { when: 'always' });


     self.pushAsset('script', 'main', { when: 'always' });
     self.pushAsset('script', 'delete-form', { when: 'always' });
     self.pushAsset('script', 'status-form', { when: 'always' });

     //because of size load in directly in template for now, in future we might consider loading them in user script
     //and load the user script also when users log in via openstad.
     //self.pushAsset('script', 'filepond', { when: 'always' });
     // self.pushAsset('script', 'trix', { when: 'always' });
   };
 }
};
