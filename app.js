/**
 * This is the startup script voor ApostrhopheCMS for the Openstad cms
 * It allows multiple CMS sites to run on this one server.
 * Works as follows:
 *  - Check if site with domain has server already,
 *  - if yes serve, otherwise check if site exists in API
 *  - if yes get site Config from API, spin up server for site, the config from API specifies the name of the mongodb database necessary for the sites
 *  - if database exists run server for visiting domain
 *  - for production/staging environment a seperate admin exists to create & copy sites, including config & mongodb database.
 *  - for local development a DEFAULT_DB can be specified if this is same as config from api a database will be created.
 * @type {[type]}
 */
require('dotenv').config();
//external libs
const path                    = require('path');
const express                 = require('express');
const apostrophe              = require('apostrophe');
const app                     = express();
const _                       = require('lodash');
const mongo                   = require('mongodb');
const rp                      = require('request-promise');
const fs                      = require('fs');
const argv                    = require('boring')();
const quote                   = require('shell-quote').quote;
const Promise                 = require('bluebird');
const basicAuth               = require('express-basic-auth');
const auth                    = require('basic-auth');
const compare                 = require('tsscmp');

//internal code
const dbExists                = require('./services/mongo').dbExists;
const openstadMap             = require('./config/map').default;
const openstadMapPolygons     = require('./config/map').polygons;
const contentWidgets          = require('./config/contentWidgets').default;
const configForHosts          = {};
const aposStartingUp          = {};

var aposServer = {};
var sampleSite;
var runningSampleSite = false;
var startingUpSampleSite = false;

app.use(express.static('public'));

function getRoot() {
    let _module = module;
    let m = _module;
    while (m.parent) {
      // The test file is the root as far as we are concerned,
      // not mocha itself
      if (m.parent.filename.match(/\/node_modules\/mocha\//)) {
        return m;
      }
      m = m.parent;
      _module = m;
    }
    return _module;
  }

function getRootDir() {
   const path = require('path');
   return path.dirname(path.resolve(getRoot().filename));
 }

 function getNpmPath(root, type) {
   const npmResolve = require('resolve');
   return npmResolve.sync(type, { basedir: getRootDir() });
 }

 function hostnameOnly(server) {
   return server.replace(/\:\d+$/, '');
 }



function getSampleSite() {
  return sampleSite ? sampleSite : null;
}

/**
 * Route for resetting the config of the server so the server will refetch
 * Necessary when making changes in the site config.
 */
app.get('/config-reset', (req, res, next) => {
  let host = req.headers['x-forwarded-host'] || req.get('host');
  host = host.replace(['http://', 'https://'], ['']);
  delete configForHosts[host];
  res.json({ message: 'Ok'});
});


app.get('/login', (req, res, next) => {
  const unauthorized = (req, res) => {
      var challengeString = 'Basic realm=Openstad';
      res.set('WWW-Authenticate', challengeString);
      return res.status(401).send('Authentication required.');
  }

  const basicAuthUser = process.env.LOGIN_CSM_BASIC_AUTH_USER;
  const basicAuthPassword = process.env.LOGIN_CSM_BASIC_AUTH_PASSWORD;



  if (basicAuthUser && basicAuthPassword) {
    var user = auth(req);

    if (!user || !compare(user.name, basicAuthUser) || ! compare(user.pass, basicAuthPassword)) {
      unauthorized(req, res);
    } else {
      next();
    }

  }

});


/**
 * Info url for debugging the apostrhopheCMS server

app.get('/info', (req, res, next) => {
  let host = req.headers['x-forwarded-host'] || req.get('host');
  host = host.replace(['http://', 'https://'], ['']);

  let sample = getSampleSite();
  res.json({
  //  running: _.keys(aposServer),
    host: host,
    generation: sample.assets.generation,
  //  configForHosts: configForHosts
  });
});
 */

app.use(function(req, res, next) {
  /**
   * Run a sample site that create the assets
   */
  if (!runningSampleSite) {
    runningSampleSite  = true;
    startingUpSampleSite = true;
    const defaultRunner = Promise.promisify(run);
    const dbName = process.env.SAMPLE_DB;

    run(dbName, {}, function(silly, apos) {
        sampleSite = apos;
        aposServer[dbName] = apos;
        startingUpSampleSite = false;
      });
  }

  /**
   * Start the servers only when the sample site has finished running
   */
  const safeStartServers = (req, res, next) => {
    if (startingUpSampleSite) {
      // timeout loop //
      setTimeout(() => {
        safeStartServers(req, res, next);
      }, 100);
    } else {
      serveSites(req, res, next);
    }
  }

  safeStartServers(req, res, next);

});


function serveSites (req, res, next) {
  let thisHost = req.headers['x-forwarded-host'] || req.get('host');
  const hostKey = thisHost === process.env.DEFAULT_HOST ? process.env.DEFAULT_DB : thisHost.replace(/\./g, '');

  thisHost = thisHost.replace(['http://', 'https://'], ['']);

  // if the config is existing it means the site has been loaded already, serve site
  if (configForHosts[thisHost]) {
    serveSite(req, res, configForHosts[thisHost], false);
  } else {

    /**
     * Fetch the config for sites
     */
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
}

function serveSite(req, res, siteConfig, forceRestart) {
  const runner = Promise.promisify(run);
  let dbName = siteConfig.config && siteConfig.config.cms && siteConfig.config.cms.dbName ? siteConfig.config.cms.dbName : '';

  // check if the mongodb database exist. The name for databse
  return dbExists(dbName).then((exists) => {
      // if default DB is set
      if (exists || dbName === process.env.DEFAULT_DB)  {

        if ( (!aposServer[dbName] || forceRestart) && !aposStartingUp[dbName]) {
            //format sitedatat so it makes more sense
            var config = siteConfig.config;
            config.id = siteConfig.id;
            config.title = siteConfig.title;

            aposStartingUp[dbName] = true;

            if (aposServer[dbName]) {
          //    aposServer[dbName].close();
            }

            runner(dbName, config).then(function(apos) {
              aposStartingUp[dbName] = false;
              aposServer[dbName] = apos;
              aposServer[dbName].app(req, res);
            });
        } else {
          const startServer = (server, req, res) => {
            server.app(req, res);
          }

          const safeStartServer = () => {
            if (aposStartingUp[dbName]) {
              // timeout loop //
              setTimeout(() => {
                safeStartServer();
              }, 100);
            } else {
              startServer(aposServer[dbName], req, res)
            }
          }

          safeStartServer();
        }

    //    console.log(aposServer)
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

  const siteConfig = {
  //multisite: self,
  afterListen: function() {
    apos._id = site._id;
    if (callback) {
      return callback(null, apos);
    }
  },
//    rootDir: getRootDir() + '/sites',
//    npmRootDir: getRootDir(),
  // shortName: 'localhost',
  shortName: site._id,
  modules: {
      'api-proxy': {},
      'apostrophe-db': {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 27017,
      },
      'apostrophe-express': {
        port: process.env.PORT
      },
      'apostrophe-docs': {
      },
      'auth': {},
      'apostrophe-multisite-fake-listener': {
        construct: function(self, options) {
          // Don't really listen for connections. We'll run as middleware
          // This is necessary for the multisite startup script
          self.apos.listen = function() {
            if (self.apos.options.afterListen) {
              return self.apos.options.afterListen(null);
            }
          }
        }
      },

      'apostrophe-attachments': {
    /*    uploadfs: {
          prefix: '/' + site._id,
          uploadsPath: getRootDir() + '/sites/public/uploads',
          uploadsUrl: '/uploads',
          tempPath: getRootDir() + '/sites/data/temp/' + site._id + '/uploadfs',
          https: true
        }*/
      },

      'apostrophe-multisite-patch-assets': {
        construct: function(self, options) {
            // use this information until afterInit
            const sample = getSampleSite();

            if (!sample) {
              return;
            }

            self.apos.assets.generationCollection = sample.assets.generationCollection;
            self.apos.assets.generation = sample.assets.generation;
          },

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
        contentWidgets: {
            'agenda' : {},
            'accordeon': {},
        /*    'apostrophe-images': {
              fields: {
                type: 'string',
                name: 'maxWidth',
                label: 'Max width'
              }
            },*/
            'arguments' : {},
            'arguments-form' : {},
            'section' : {
              addLabel: 'Columns',
              controls: {
                movable: true,
                removable: true,
                position: 'bottom-left'
              },
            },
            'slider' : {},
            'counter' : {
              addLabel: 'Counter',
            },
            'date-bar' : {},
            'idea-form' : {},
            'idea-map': {},
            'idea-overview' : {},
            'idea-single' : {},
            'ideas-on-map': {
              addLabel: 'Ideeen op een kaart',
            },
            'iframe' : {},
            'header' : {},
            'image' : {},
            'info-bar' : {},
            'link': {},
            'list' : {},
            'gebiedsontwikkeling-tool': {
              addLabel: 'Map for area development',
            },
            'begroot': {
              addLabel: 'Participatory budgetting',
            },
            'main-image' : {},
            'apostrophe-rich-text': {
              toolbar: [ 'Styles', 'Bold', 'Italic', 'Link', 'Unlink', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', ],
              styles: [
                { name: 'Paragraph', element: 'p' }
              ],
              controls: {
                movable: true,
                removable: true,
                position: 'top-left'
              }
            },

            'speech-bubble' : {
              controls: {
                position: 'top-left'
              },
            },
            'title' : {},
            'user-form' : {},
            'local-video': {
              addLabel: 'Video (upload)',
            },
            'apostrophe-video' : {
              addLabel: 'Video (3d party, youtube, vimeo, etc.)',
            },

        }
      },

      // Apostrophe module configuration

      // Note: most configuration occurs in the respective
      // modules' directories. See lib/apostrophe-assets/index.js for an example.

      // However any modules that are not present by default in Apostrophe must at
      // least have a minimal configuration here: `moduleName: {}`

      // If a template is not found somewhere else, serve it from the top-level
      // `views/` folder of the project
      'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
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
          },
          {
            name: 'home',
            label: 'Home'
          },
        ]
      },
      'apostrophe-global': {},
      'section-widgets': {},
      'all-on-one-row-widgets': {},
      'card-widgets': {},
      'iframe-widgets': {},
      'speech-bubble-widgets': {},
      'header-widgets': {},
      'title-widgets': {},
      'main-image-widgets': {},
      'list-widgets': {},
      'agenda-widgets': {},
      'accordeon-widgets': {},
      'idea-overview-widgets': {},
      'icon-section-widgets': {},
      'idea-single-widgets': {},
      'idea-form-widgets': {},
      'ideas-on-map-widgets': {},
      'date-bar-widgets': {},
      'idea-map-widgets': {},
      'iframe-widgets': {},
      'link-widgets': {},
      'counter-widgets': {},
      'slider-widgets': {},
      'arguments-widgets': {},
      'arguments-form-widgets': {},
      'gebiedsontwikkeling-tool-widgets': {},
      'user-form-widgets': {},
      'submissions-widgets': {},
      'begroot-widgets': {},
      'local-video-widgets': {},
      'one-row-widgets': {},
      'image-widgets': {},
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
            name: 'textNavColor',
            label: 'Text color of the items in the navigation bar',
            type: 'color',
            selector: '#navbar a',
            property: 'color',
          },
          {
            name: 'textHoverNavColor',
            label: 'Text color when hovering over the items in the navigation bar',
            type: 'color',
            selector: '#navbar a:hover',
            property: 'color',
          },
          {
            name: 'textLineNavColor',
            label: 'Color of the underline of the items in the navigation bar',
            type: 'color',
            unit: '!important',
            selector: '#mainMenu .nav-link',
            property: 'border-color',
          },
          {
            name: 'backgroundFooterColor',
            label: 'Background color of the footer',
            type: 'color',
            selector: 'footer',
            property: 'background-color',
          },
          {
            name: 'textFooterColor',
            label: 'Color of the text in the footer',
            type: 'color',
            selector: ['footer .container h2', 'footer .container p', 'footer .container a'],
            property: 'color',
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
            fields: ['backgroundNavColor', 'textNavColor', 'textHoverNavColor', 'textLineNavColor', 'backgroundFooterColor', 'textFooterColor']
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
          { name: 'shuffle.min' },
          { name: 'sort' },
          { name: 'jquery.validate.min' },
          { name: 'jquery.dataTables.min' },
          { name: 'jquery.validate.min' },
          { name: 'jquery.validate.nl' },
        ],
        stylesheets: [
          { name: 'main' }
        ],
      },
      'info-bar-widgets' : {},
      'apostrophe-area-structure': {},
    }
  };

  const useAposWorkflow = siteData.cms && siteData.cms.aposWorkflow;
  const turnOffWorkflow = siteData.cms && siteData.cms.turnOffWorkflow;

  // If apostrophe workflow is turned o
  if ((process.env.APOS_WORKFLOW === 'ON' || useAposWorkflow) && !turnOffWorkflow) {
    siteConfig.modules['apostrophe-workflow'] = {
      // IMPORTANT: if you follow the examples below,
      // be sure to set this so the templates work
      alias: 'workflow',
      // Recommended to save database space. You can still
      // export explicitly between locales
      replicateAcrossLocales: true,
    };

    siteConfig.modules['apostrophe-workflow-modified-documents'] = {};

  } else {
    siteConfig.modules['apostrophe-i18n'] = {
      locales:['nl', 'en'],
      directory: __dirname + '/locales',
      defaultLocale: 'nl'
    }
  }

  siteConfig.configureNunjucks = function(env) {
      env.addFilter('repeat', function(s, n) {
        var r = '';
        while (n--) {
          r += s;
        }
        return r;
      });
  }

  const apos = apostrophe(
    _.merge(siteConfig, siteData)
  );

}

/*
process.on('uncaughtException', function (exception) {
  console.log('here', exception);
})
*/
app.listen(process.env.PORT);
