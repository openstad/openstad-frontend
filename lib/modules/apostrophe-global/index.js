const polygons   = require('../../../config/map').default.polygons;
const polygonsFormatted = [{label: 'Geen', value: ''}];

Object.keys(polygons).forEach(function(key) {
  polygonsFormatted.push({
    label: key,
    value: key //polygons[key]
  });
});


module.exports = {
  addFields: [
    {
      type: 'string',
      name: 'siteTitle',
      label: 'Site title'
    },
    {
      name: 'fbImage',
      type: 'attachment',
      svgImages: true,
      label: 'Default FB image when sharing pages (gets overwritten when sharing ideas)',
      trash: true
    },
    {
      type: 'string',
      name: 'siteId',
      label: 'Site ID (!important for api calls)'
    },
    {
      name: 'ideaSlug',
      type: 'string',
      label: 'Slug van idee pagina',
      required: true
    },
    {
      name: 'ideaOverviewSlug',
      type: 'string',
      label: 'Slug van overzichts pagina',
      required: true
    },
    {
      type: 'string',
      name: 'analytics',
      label: 'Google Analytics Property ID (like UA-xxxxx)'
    },
    {
      name: 'siteLogo',
      type: 'attachment',
      svgImages: true,
      label: 'Logo',
      trash: true
    },
    {
      name: 'mapCenterLat',
      type: 'float',
      label: 'Map center Latitude',
    },
    {
      name: 'mapCenterLng',
      type: 'float',
      label: 'Map center Longtitude',
    },
    {
      name: 'mapZoomLevel',
      type: 'range',
      label: 'Map zoom level',
      min: 12,
      max: 17,
      step: 1 // optional
    },
    {
      name: 'mapPolygonsKey',
      type: 'select',
      label: 'Selecteer een polygon',
      choices: polygonsFormatted
    },
    {
      name: 'openstreetmapsServerUrl',
      type: 'string',
      label: 'Openstreet Maps ServerUrl (not implemented yet)',
      min: 2,
      max: 15,
      step: 1 // optional
    },
    {
      name: 'ctaButtonText',
      type: 'string',
      label: 'CTA button text',
    },
    {
      name: 'ctaButtonUrl',
      type: 'string',
      label: 'CTA button url',
    },
  ],
  construct: function (self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['siteTitle', 'analytics', 'fbImage']
      },
      {
        name: 'api',
        label: 'API instellingen',
        fields: ['siteId', 'ideaSlug', 'ideaOverviewSlug']
      },
      {
        name: 'design',
        label: 'Vormgeving',
        fields: ['siteLogo']
      },
      {
        name: 'map',
        label: 'Map',
        fields: ['mapCenterLat', 'mapCenterLng', 'mapZoomLevel', 'openstreetmapsServerUrl', 'mapPolygonsKey']
      },
      {
        name: 'mainMenu',
        label: 'Hoofdmenu',
        fields: ['ctaButtonText', 'ctaButtonUrl']
      },

    ]);
  //    self.pageBeforeSend = (req, callback) => {
    //    console.log(req.data);
      self.apos.app.use((req, res, next) => {
        //console.log('====> req.session', req.session);

        //add query tot data object, so it can be used
        req.data.query = req.query;

        // add the polygon object to the global data object
        if (req.data.global.mapPolygonsKey) {
          req.data.global.mapPolygons = polygons[req.data.global.mapPolygonsKey];
        }

        next();
      });
  }
};

/**
 *
 *
 *
@TODO arrangeFields
 // Separate the palette field names so we can group them in a tab
var fieldNames = _.map(options.paletteFields, function (field) {
  return field.name
});


 *
 */
