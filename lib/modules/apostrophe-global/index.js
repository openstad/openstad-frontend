const auth              = require('basic-auth')
const compare           = require('tsscmp')
const fields            = require('./lib/fields');
const arrangeFields     = require('./lib/arrangeFields');

function unauthorized(req, res) {
    var challengeString = 'Basic realm=Openstad';
    res.set('WWW-Authenticate', challengeString);
    return res.status(401).send('Authentication required.');
}

module.exports = {
  addFields: fields,
  afterConstruct: function(self) {
    self.expressMiddleware.push(self.overrideGlobalDataWithSiteConfig);
  },
  construct: function (self, options) {
    require('./lib/api')(self, options);

    self.on('apostrophe:modulesReady', 'setSyncFields');
    self.on('apostrophe-docs:afterSave', 'syncApi');

    options.arrangeFields = (options.arrangeFields || []).concat(arrangeFields);

    // Todo: what is this middleware and why is it in this module?
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

    self.loadPolygonsFromApi = async function () {
      try {
        const areas = await self.apos.openstadApi.getAllPolygons();

        if (areas) {
          return [{label: 'Geen', value: ''}].concat(areas.map((area) => {
            return {
              label: area.name,
              value: area.id
            }
          }))
        }
        throw new Error('No polygons found');
      } catch (error) {
        // @todo: proper error handling
        console.log (error);
        return [];
      }
    }
        // load env sheets that have been set for complete Environment, not just one site specific
        if (process.env.STYLESHEETS) {
          const sheets = process.env.STYLESHEETS.split(',');
          //make sure we
          req.data.envStyleSheets = sheets;
        }

        //for legacy purposes, remove to better solutions at some point
        //Amsterdam
        if (process.env.LOGO_AMSTERDAM && process.env.LOGO_AMSTERDAM === 'yes') {
          //make sure we
          req.data.global.siteLogo = 'amsterdam';
        }

        req.data.global.siteConfig = siteConfig;
        req.data.originalUrl = req.originalUrl;

        // get the identifier for making sure that the custom js/css files we load in also bust the cache
        req.data.assetsGeneration = fs.existsSync('data/generation') ? fs.readFileSync('data/generation').toString().trim() : Math.random().toString(36).slice(-5);; // TODO: laadt dit ergens eenmalig in en stop het in een global var

        //add query tot data object, so it can be used
        req.data.query = req.query;

        // add the polygon object to the global data object
        if (req.data.global.mapPolygonsKey) {
          req.data.global.mapPolygons = polygons[req.data.global.mapPolygonsKey];
        }
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
