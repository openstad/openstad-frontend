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



const openstadMap           = require('./config/map').default;
const openstadMapPolygons   = require('./config/map').polygons;
const configForHosts        = {};
const aposStartingUp        = {};
//console.log('process.env', process.env);

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

/*
  const keys = finio;



  if (!keys.length ) {
    return null;
  }

  let server = _.find(aposServer, apos => (typeof apos) === 'object');

*/
}

/**
 * Route for resetting the config of the server so the server will refetch
 * Necessary when making changes in the site config.
 */
app.get('/config-reset', (req, res, next) => {
  let host = req.headers['x-forwarded-host'] || req.get('host');
  host = host.replace(['http://', 'https://'], ['']);
  console.log('configForHosts', configForHosts);

  delete configForHosts[host];
  console.log('configForHosts', configForHosts);
  res.json({ message: 'Ok'});
});


app.get('/info', (req, res, next) => {
  let host = req.headers['x-forwarded-host'] || req.get('host');
  host = host.replace(['http://', 'https://'], ['']);
  let sample = getSampleSite();
  res.json({
    running: _.keys(aposServer),
    host: host,
    generation: sample.assets.generation,
    configForHosts: configForHosts
  });
});

app.use(function(req, res, next) {
  // run sample server
  //

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
}

function serveSite(req, res, siteConfig, forceRestart) {
  const runner = Promise.promisify(run);
  let dbName = siteConfig.config && siteConfig.config.cms && siteConfig.config.cms.dbName ? siteConfig.config.cms.dbName : '';

  return dbExists(dbName).then((exists) => {
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
        beforeConstruct: function(self, options) {
          options.permission = false;
        }
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
            // The sites should share a collection for this purpose,
            // so they don't fail to see that a bundle has already been
            // generated via a temporary site during deployment
          //  self.apos.assets.generationCollection = dashboard.db.collection('sitesAssetGeneration');
            // Use a separate uploadfs instance for assets, so that the
            // sites share assets but not attachments

         //  self.apos.assets.uploadfs = function() {
          //    return self.uploadfs;
          //  };


            // For dev: at least one site has already started up, which
            // means assets have already been attended to. Steal its
            // asset generation identifier so they don't fight.
            // We're not too late because apostrophe-assets doesn't
            // use this information until afterInit
            const sample = getSampleSite();


            if (!sample) {
              return;
            }

        //    console.log('===>>>> sample.assets ', sample.assets);

            console.log('===>>>> sample.assets.generation ', sample.assets.generation);

            self.apos.assets.generationCollection = sample.assets.generationCollection;
            self.apos.assets.generation = sample.assets.generation;
          },

/*        afterConstruct: function(self, callback) {
          return self.initUploadfs(callback);
        }*/
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
            /*  toolbar : [
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
                { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
              ],*/
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
      //      'user-form' : {},
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
          },
          {
            name: 'home',
            label: 'Home'
          },
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
      'idea-overview-widgets': {},
      'icon-section-widgets': {},
      'idea-single-widgets': {},
      'idea-form-widgets': {},
      'date-bar-widgets': {},
      'idea-map-widgets': {},
    //  'idea-voting-widgets': {},
      'link-widgets': {},
      'counter-widgets': {},
      'slider-widgets': {},
      'arguments-widgets': {},
      'arguments-form-widgets': {},
      'gebiedsontwikkeling-tool-widgets': {},
      'user-form-widgets': {},
      'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
      'submissions-widgets': {},
      'begroot-widgets': {},
      'local-video-widgets': {},
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
      'info-bar-widgets' : {},
      'apostrophe-area-structure': {},
    }
  };


  const useAposWorkflow = siteData.cms && siteData.cms.aposWorkflow;
  const turnOffWorkflow = siteData.cms && siteData.cms.turnOffWorkflow;

  if ((process.env.APOS_WORKFLOW === 'ON' || useAposWorkflow) && !turnOffWorkflow) {
    siteConfig.modules['apostrophe-workflow'] = {
      // IMPORTANT: if you follow the examples below,
      // be sure to set this so the templates work
      alias: 'workflow',
      // Recommended to save database space. You can still
      // export explicitly between locales
      replicateAcrossLocales: true,

  /*  locales: [
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
    };

    siteConfig.modules['apostrophe-workflow-modified-documents'] = {};
  }

  siteConfig.configureNunjucks = function(env) {
    console.log('>>>>>> nunjucksEnv', env);
      env.addFilter('repeat', function(s, n) {
        var r = '';
        while (n--) {
          r += s;
        }
        return r;
      });
    }

//  console.log('siteConfigsiteConfig', siteConfig.modules);

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

/**
 * Run default SITE DATABASE if isset, this way when deploying
 * the site is already spin up and assets will be generated


if (process.env.DEFAULT_DB) {
  const defaultRunner = Promise.promisify(run);
  const dbName = process.env.DEFAULT_DB;

  defaultRunner(dbName).then(function(apos) {
    aposServer[dbName] = apos;
  });
}
 */
