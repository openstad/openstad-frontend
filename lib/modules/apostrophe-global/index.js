const polygons          = require('../../../config/map').default.polygons;
const polygonsFormatted = [{label: 'Geen', value: ''}];
const basicAuth         = require('express-basic-auth')
const auth              = require('basic-auth')
const compare            = require('tsscmp')


Object.keys(polygons).forEach(function(key) {
  polygonsFormatted.push({
    label: key,
    value: key //polygons[key]
  });
});

const rightsChoices =  [
  {
    label: 'Anonymous',
    value: 'anonymous'
  },
  {
    label: 'Registered user',
    value: 'member'
  }
];

const flagChoices = [
    {
        label: 'Groen',
        value: 'green'
    },
    {
        label: 'Donkergroen',
        value: 'dark-green'
    },
    {
        label: 'Grijs',
        value: 'gray'
    },
    {
        label: 'Donkergrijs',
        value: 'dark-gray'
    },
    {
        label: 'Geel',
        value: 'yellow'
    },
    {
        label: 'Blauw',
        value: 'blue'
    },
    {
        label: 'Donkerblauw',
        value: 'dark-blue'
    },
    {
        label: 'Rood',
        value: 'red'
    },
    {
        label: 'Donkerrood',
        value: 'dark-red'
    },
    {
        label: 'Paars',
        value: 'purple'
    },
];


function unauthorized(req, res) {
    var challengeString = 'Basic realm=Openstad';
    res.set('WWW-Authenticate', challengeString);
    return res.status(401).send('Authentication required.');
}

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
      name: 'stylesheets',
      label: 'External stylesheets',
      type: 'array',
      titleField: 'url',
      schema: [
        {
          type: 'string',
          name: 'url',
          label: 'Url'
        },
      ]
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
      label: 'Site ID (overwrite the default site id)'
    },
    {
      name: 'ideaSlug',
      type: 'string',
      label: 'Slug van idee pagina',
      required: false
    },
    {
      name: 'ideaOverviewSlug',
      type: 'string',
      label: 'Slug van overzichts pagina',
      required: false
    },
    {
      name: 'editIdeaUrl',
      type: 'string',
      label: 'Url van de bewerk pagina',
      required: false
    },
    {
      name: 'modbreakAuthor',
      type: 'string',
      label: 'Author of the modbreaks',
      required: false
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
        },
        {
          name: 'flag',
          type: 'select',
          label: 'Welke vlag moet er getoond worden bij dit thema?',
          choices: flagChoices,
          def: 'blue'
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
      name: 'topLinks',
      type: 'array',
      label: 'Top Links',
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
        {
          name: 'targetBlank',
          type: 'boolean',
          label: 'Open in new window',
        },
      ]
    },
    {
      name: 'displayMyAcount',
      type: 'boolean',
      label: 'Display my account in menu?'
    },
    {
      name: 'cacheIdeas',
      type: 'boolean',
      label: 'Cache ideas? This optimises performance for sites, only works for sites where ideas are static, most voting sits'
    },
    {
      name: 'newsletterModalTitle',
      type: 'string',
      label: 'Title for the popup',
      textarea: true,
  //    def: 'Sign up for the newsletter'
    },
    {
      name: 'newsletterModalDescription',
      type: 'string',
      label: 'Description for the popup',
      textarea: true,
    //  def: 'Sign up for the newsletter to stay up to date when news about this project.'
    },
    {
      name: 'translations',
      type: 'array',
      titleField: 'label',
      label: 'Translations',
      schema: [
        {
          name: 'translation',
          type: 'text',
          label: 'Translation',
          type: 'string',
        },
        {
          name: 'translationUrl',
          type: 'text',
          label: 'Translation page URL',
          type: 'string',
        }
      ]
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
            {
              name: 'targetBlank',
              type: 'boolean',
              label: 'Open in new window',
            },
          ]
        },
      ]
    },
    {
      name: 'roleToLike',
      type: 'select',
      label: 'What role is necessary to like an idea?',
      choices: rightsChoices,
      def: 'member'
    },
/*    {
      name: 'roleToComment',
      type: 'select',
      label: 'What role is necessary to comment?',
      choices: rightsChoices,
      def: 'member'
    },*/
  ],
  construct: function (self, options) {
    self.apos.app.use((req, res, next) => {
      const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
      if (siteConfig.basicAuth && siteConfig.basicAuth.active) {
        var user = auth(req);

        if (!user || !compare(user.name, siteConfig.basicAuth.user) || ! compare(user.pass, siteConfig.basicAuth.password)) {
          unauthorized(req, res);
        } else {
          next();
        }

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
        label: 'Url & api instellingen',
        fields: ['siteId', 'ideaSlug', 'ideaOverviewSlug', 'editIdeaUrl', 'cacheIdeas']
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
        fields: ['ctaButtonText', 'ctaButtonUrl', 'topLinks', 'displayMyAcount', 'translations']
      },
      {
        name: 'userRights',
        label: 'Roles & Rights',
        fields: ['roleToLike', 'roleToComment']
      },
      {
        name: 'newsletter',
        label: 'Newsletter',
        fields: ['newsletterModalTitle', 'newsletterModalDescription']
      },
    ]);

  //    self.pageBeforeSend = (req, callback) => {
    //    console.log(req.data);
      self.apos.app.use((req, res, next) => {
        const siteConfig = self.apos.settings.getOption(req, 'siteConfig');

        // Take default site ID, possible to overwritten
        if (!req.data.global.siteId) {
          req.data.global.siteId = siteConfig.id;
        }

        req.data.global.siteConfig = siteConfig;
        req.data.originalUrl = req.originalUrl;

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
