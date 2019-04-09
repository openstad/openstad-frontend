module.exports = {
  addFields: [
    {
      type: 'string',
      name: 'siteTitle',
      label: 'Site title'
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
      name: 'openstreetmapsServerUrl',
      type: 'string',
      label: 'Openstreet Maps ServerUrl (not implemented yet)',
      min: 2,
      max: 15,
      step: 1 // optional
    },
  ],
  construct: function (self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['siteTitle', 'analytics']
      },
      {
        name: 'api',
        label: 'API instellingen',
        fields: ['siteId', 'ideaSlug']
      },
      {
        name: 'design',
        label: 'Vormgeving',
        fields: ['siteLogo']
      },
      {
        name: 'map',
        label: 'Map',
        fields: ['mapCenterLat', 'mapCenterLng', 'mapZoomLevel', 'openstreetmapsServerUrl']
      },

    ]);
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
