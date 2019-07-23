require('dotenv').config();

const path          = require('path');
const express       = require('express');
const apostrophe    = require('apostrophe');
const app           = express();
const _             = require('lodash');
const mongo         = require('mongodb');
const rp            = require('request-promise');
const fs            = require('fs');
const argv          = require('boring')();
const quote         = require('shell-quote').quote;
const Promise       = require('bluebird');
const dbExists      = require('./services/mongo').dbExists;

//const flash         = require('express-flash');

const openstadMap           = require('./config/map').default;
const openstadMapPolygons   = require('./config/map').polygons;
const configForHosts = {};
//console.log('process.env', process.env);

var aposServer = {};
app.use(express.static('public'));


function getSampleSite() {
  const keys = _.keys(aposServer);

  if (!keys.length) {
    return null;
  }
  // Find the first one that isn't a status string like "pending"
  return _.find(aposServer, apos => (typeof apos) === 'object');
}


app.get('/config-reset', (req, res, next) => {
  let host = req.headers['x-forwarded-host'] || req.get('host');
  host = host.replace(['http://', 'https://'], ['']);
  delete configForHosts[host];
  res.json({ message: 'Ok'});
});

app.use(function(req, res, next) {
//  const hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host
//  const host = hostname; //req.get('host');
  let thisHost = req.headers['x-forwarded-host'] || req.get('host');
  const hostKey = thisHost === process.env.DEFAULT_HOST ? process.env.DEFAULT_DB : thisHost.replace(/\./g, '');

  thisHost = thisHost.replace(['http://', 'https://'], ['']);

  if (configForHosts[thisHost]) {
    serveSite(req, res, configForHosts[thisHost], false);
  } else {
    const siteOptions = {
        uri:`${process.env.API}/api/site/${thisHost}`, //,
        headers: {
            'Accept': 'application/json',
            "Cache-Control": "no-cache"
        },
        json: true // Automatically parses the JSON string in the response
    };

    if (process.env.SITE_API_KEY) {
      siteOptions.headers["X-Authorization"] = process.env.SITE_API_KEY;
    }

    rp(siteOptions)
      .then((siteConfig) => {
        configForHosts[thisHost] = siteConfig;
        serveSite(req, res, siteConfig, true);
      }).catch((e) => {
          res.status(500).json({ error: 'An error occured fetching the site config: ' + e });
      });
  }

//  apos = await runner(options.sites || {});
});

function serveSite(req, res, siteConfig, forceRestart) {
  const runner = Promise.promisify(run);

  let dbName = siteConfig.config && siteConfig.config.cms && siteConfig.config.cms.dbName ? siteConfig.config.cms.dbName : '';

  console.log('siteConfig', siteConfig);

  console.log('dbName', dbName);

  return dbExists(dbName).then((exists) => {
      if (exists || dbName === process.env.DEFAULT_DB)  {


        if (!aposServer[dbName] || forceRestart) {
            //format sitedatat so it makes more sense
            var config = siteConfig.config;
            config.id = siteConfig.id;
            config.title = siteConfig.title;

            runner(dbName, config).then(function(apos) {
              aposServer[dbName] = apos;
              aposServer[dbName].app(req, res);
            });
        } else {
          aposServer[dbName].app(req, res);
        }
      } else {
        res.status(404).json({ error: 'Not found page or website' });
      }
    })
  .catch((e) => {
    console.log('err: ', e);
    res.status(500).json({ error: 'An error occured checking if the DB exists: ' + e });
  });
}

function run(id, siteData, callback) {
  const options = { }
  const site = { _id: id}
  const apos = apostrophe(
    _.merge({
      //multisite: self,
      afterListen: function() {
        apos._id = site._id;
        return callback(null, apos);
      },
  //    rootDir: getRootDir() + '/sites',
  //    npmRootDir: getRootDir(),
      //shortName: 'localhost',
      shortName: site._id,
      modules: {
				'apostrophe-db': {
					host: process.env.DB_HOST || 'localhost',
					port: process.env.DB_PORT || 27017,
				},
        'apostrophe-express': {
          port: process.env.PORT
        },

      /*  'apostrophe-i18n': {
             locales: ['nl', 'en'],
             defaultLocale: 'nl'
        },*/
        'apostrophe-workflow': {
          // IMPORTANT: if you follow the examples below,
          // be sure to set this so the templates work
          alias: 'workflow',
          // Recommended to save database space. You can still
          // export explicitly between locales
          replicateAcrossLocales: true,

      /*    locales: [
            {
              name: 'default',
              label: 'Default',
              private: true,
              children: [
                {
                  name: 'nl',
                  label: 'Netherlands'
                },
                {
                  name: 'en',
                  label: 'English'
                },

              ]
            },
          ],*/
        },
        'apostrophe-workflow-modified-documents': {},
    /*    'apostrophe-docs': {
          beforeConstruct: function(self, options) {
            console.log('==>>>> beforeConstruct', options);
            options.permission = false;
          }
        },*/
        'auth': {},
        'apostrophe-multisite-fake-listener': {
          construct: function(self, options) {
            // Don't really listen for connections. We'll run as middleware
            self.apos.listen = function() {
              if (self.apos.options.afterListen) {
                return self.apos.options.afterListen(null);
              }
            }
          }
        },

        'apostrophe-multisite-patch-assets': {
          construct: function(self, options) {
            // At least one site has already started up, which means
            // assets have already been attended to. Steal its
            // asset generation identifier so they don't fight.
            // We're not too late because apostrophe-assets doesn't
            // use this information until afterInit
            const sample = getSampleSite();
            if (!sample) {
              return;
            }
            self.apos.assets.generation = sample.assets.generation;
          }
        },

        settings: {
          // So we can write `apos.settings` in a template
          alias: 'settings',
          apiUrl: process.env.API,
          appUrl: process.env.APP_URL,
          apiLogoutUrl:  process.env.API_LOGOUT_URL,
          openStadMap: openstadMap,
          openstadMapPolygons: openstadMapPolygons,
          googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
          siteConfig: siteData,
          // Let's pass in a Google Analytics id, just as an example
          contentWidgets: {
              'agenda' : {},
              'accordeon': {},
              'apostrophe-images': {
                fields: {
                  type: 'string',
                  name: 'maxWidth',
                  label: 'Max width'
                }
              },
              'arguments' : {},
              'arguments-form' : {},
              'gebiedsontwikkeling-tool': {},
              'apostrophe-rich-text': {
                toolbar: [ 'Styles', 'Bold', 'Italic', 'Link', 'Unlink', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', ],

              /*  toolbar : [
                  { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
               	  { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
                ],*/
                styles: [
                  { name: 'Heading 1', element: 'h1' },
                  { name: 'Heading 2', element: 'h2' },
                  { name: 'Heading 3', element: 'h3' },
                  { name: 'Heading 4', element: 'h4' },
                  { name: 'Paragraph', element: 'p' }
                ],
                controls: {
                  movable: true,
                  removable: true,
                  position: 'top-right'
                }
              },
              'begroot': {},
              'card' : {},
              'counter' : {},
              'date-bar' : {},
              'idea-overview' : {},
              'idea-map': {},
              'link': {},
              'idea-single' : {},
              'idea-form' : {},
              'list' : {},
              'main-image' : {},
              'speech-bubble' : {},
              'title' : {},
              'user-form' : {},
              'submissions' : {},
              'section' : {
                addLabel: 'Add a section',
                controls: {
                  movable: true,
                  removable: true,
                  position: 'bottom-left'
                },
              },
              'slider' : {},
              'local-video': {},
              'apostrophe-video' : {'label': '3d party video'}
          }
        },

        // Apostrophe module configuration

        // Note: most configuration occurs in the respective
        // modules' directories. See lib/apostrophe-assets/index.js for an example.

        // However any modules that are not present by default in Apostrophe must at
        // least have a minimal configuration here: `moduleName: {}`

        // If a template is not found somewhere else, serve it from the top-level
        // `views/` folder of the project

    //    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
        'idea-pages': {},
        'apostrophe-pages': {
          types: [
            {
              name: 'default',
              label: 'Default'
            },
            {
              name: 'idea',
              label: 'Idea'
            }
          ]
        },
        'apostrophe-global': {},
      /*  'one-column-widgets': {},
        'two-column-widgets': {},
        'four-column-widgets': {},
        'three-column-widgets': {},
        'two-third-column-widgets': {},
        'spacer-widgets': {},*/
        'section-widgets': {},
        'card-widgets': {},
        'iframe-widgets': {},
        'speech-bubble-widgets': {},
        'title-widgets': {},
        'main-image-widgets': {},
        'list-widgets': {},
        'agenda-widgets': {},
        'accordeon-widgets': {},
        'slider-widgets': {},
        'idea-overview-widgets': {},
        'icon-section-widgets': {},
        'idea-single-widgets': {},
        'idea-form-widgets': {},
        'date-bar-widgets': {},
        'idea-map-widgets': {},
        'idea-voting-widgets': {},
        'link-widgets': {},
        'counter-widgets': {},
        'arguments-widgets': {},
        'arguments-form-widgets': {},
        'gebiedsontwikkeling-tool-widgets': {},
        'user-form-widgets': {},
        'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
        'submissions-widgets': {},
        'begroot-widgets': {},
        'local-video-widgets': {},
        'apostrophe-palette-widgets': {},
        'apostrophe-palette': {},
        'apostrophe-video-widgets': {},
        'apostrophe-palette-global': {
          paletteFields: [
            {
              name: 'backgroundNavColor',
              label: 'Background color of the navigation bar',
              type: 'color',
              selector: '#navbar',
              property: 'background-color',
            },
            {
              name: 'backgroundFooterColor',
              label: 'Background color of the footer',
              type: 'color',
              selector: 'footer',
              property: 'background-color',
            },
            {
              name: 'logoWidth',
              label: 'Logo breedte',
              type: 'range',
              selector: ['#logo-image'],
              property: ['width'],
              min: 25,
              max: 300,
              step: 1,
              unit: 'px',
        //      mediaQuery: '(max-width: 59.99em)'
            },
          ],
          arrangePaletteFields: [
            {
              name: 'colorFields',
              label: 'Kleuren',
              fields: ['backgroundNavColor', 'backgroundFooterColor']
            },
            {
              name: 'logoFields',
              label: 'Logo instellingen',
              fields: ['logoWidth']
            },
          ]
        },
        'apostrophe-assets' : {
            minify: process.env.MINIFY_JS && (process.env.MINIFY_JS == 1 || process.env.MINIFY_JS === 'ON'),
            scripts: [
              { name: 'cookies' },
              { name: 'site' },
              { name: 'jquery.validate.min' },
              { name: 'jquery.validate.nl' },
            ],
            stylesheets: [
              { name: 'main' }
            ],
        },
        'api-proxy': {}

      }
    }, siteData)
  );

}

/*
process.on('uncaughtException', function (exception) {
  console.log('here', exception);
})
*/
app.listen(process.env.PORT);

/**
 * Run default SITE DATABASE if isset, this way when deploying
 * the site is already spin up and assets will be generated
 */
/*
if (process.env.DEFAULT_DB) {
  const defaultRunner = Promise.promisify(run);
  const dbName = process.env.DEFAULT_DB;

  defaultRunner(dbName).then(function(apos) {
    aposServer[dbName] = apos;
  });
}
*/
