const polygons          = require('../../../config/map').default.polygons;
const polygonsFormatted = [{label: 'Geen', value: ''}];
const basicAuth         = require('express-basic-auth')

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
      name: 'favicon',
      type: 'attachment',
      svgImages: true,
      label: 'Favicon',
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
    },
    {
      name: 'areas',
      type: 'array',
      titleField: 'label',
      label: 'Buurten',
      schema: [
        {
          name: 'value',
          type: 'text',
          label: 'Name',
          type: 'string',
        }
      ]
    },
    {
      name: 'themes',
      type: 'array',
      titleField: 'label',
      label: 'Thema\'s',
      schema: [
        {
          name: 'value',
          type: 'text',
          label: 'Name',
          type: 'string',
        }
      ]
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
    {
      name: 'footer',
      type: 'array',
      titleField: 'title',
      schema: [
        {
          name: 'title',
          type: 'text',
          label: 'Titel',
          type: 'string',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          type: 'string',
          textarea: true
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          titleField: 'label',
          schema: [
            {
              name: 'label',
              type: 'string',
              label: 'Label',
            },
            {
              name: 'url',
              type: 'string',
              label: 'Url',
            },
          ]
        },
      ]
    },
  ],
  construct: function (self, options) {
    self.apos.app.use((req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

      if (siteConfig.basicAuth && siteConfig.basicAuth.status && siteConfig.basicAuth.status === 'on') {
        return   basicAuth({
            users: siteConfig.basicAuth.users
        })


        //next();
      } else {
        next();
      }
    });

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['siteTitle', 'analytics', 'fbImage', 'favicon']
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
        name: 'footer',
        label: 'Footer',
        fields: ['footer']
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
        const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

        //console.log('====> req.session', req.session);

        // Take default site ID, possible to overwritten
        if (!req.data.global.siteId) {
          req.data.global.siteId = siteConfig.id;
        }

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
