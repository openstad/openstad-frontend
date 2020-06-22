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
const express                 = require('express');
const http2                   = require('http2');
const apostrophe              = require('apostrophe');
const app                     = express();
const _                       = require('lodash');
const rp                      = require('request-promise');
const Promise                 = require('bluebird');
const auth                    = require('basic-auth');
const compare                 = require('tsscmp');

//internal code
const dbExists                = require('./services/mongo').dbExists;
const openstadMap             = require('./config/map').default;
const openstadMapPolygons     = require('./config/map').polygons;
const defaultSiteConfig       = require('./config/siteConfig');

const configForHosts          = {};
const aposStartingUp          = {};

var aposServer = {};

app.use(express.static('public'));

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

function serveSites (req, res, next) {
  let thisHost = req.headers['x-forwarded-host'] || req.get('host');

  thisHost = thisHost.replace(['http://', 'https://'], ['']);

  // if the config is existing it means the site has been loaded already, serve site
  if (configForHosts[thisHost]) {
    try {
      serveSite(req, res, configForHosts[thisHost], false);
    } catch (e) {
      console.log('-->> e', e);
    }
  } else {

    /**
     * Fetch the config for site by making a call with the domain
     */
    const apiUrl = process.env.INTERNAL_API_URL ? process.env.INTERNAL_API_URL : process.env.API;
    
    const siteOptions = {
        uri:`${apiUrl}/api/site/${thisHost}`, //,
        headers: {
            'Accept': 'application/json',
            "Cache-Control": "no-cache"
        },
        json: true // Automatically parses the JSON string in the response
    };

    // ADD site key if set, necessary for sensitive admin info
    if (process.env.SITE_API_KEY) {
      siteOptions.headers["X-Authorization"] = process.env.SITE_API_KEY;
    }

    rp(siteOptions)
      .then((siteConfig) => {
        console.info('Caching config for site: %s -> %j:', thisHost, siteConfig);

        configForHosts[thisHost] = siteConfig;
        serveSite(req, res, siteConfig, true);
      }).catch((e) => {
          console.error('An error occurred fetching the site config:', e);
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

        if ((!aposServer[dbName] || forceRestart) && !aposStartingUp[dbName]) {
            //format sitedata so  config values are in the root of the object
            var config = siteConfig.config;
            config.id = siteConfig.id;
            config.title = siteConfig.title;
            config.area = siteConfig.area;

            aposStartingUp[dbName] = true;

            runner(dbName, config, req.options).then(function(apos) {
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
              // old school timeout loop to make sure we dont start multiple servers of the same site
              setTimeout(() => {
                safeStartServer();
              }, 100);
            } else {
              startServer(aposServer[dbName], req, res)
            }
          }

          safeStartServer();
        }

      } else {
        res.status(404).json({ error: 'Not found page or website' });
      }
    })
  .catch((e) => {
    console.error('An error occurred checking if the DB exists:', e);
    res.status(500).json({ error: 'An error occured checking if the DB exists: ' + e });
  });
}

function run(id, siteData, options, callback) {
  const site = { _id: id}

  const config = _.merge(siteData, options);

  const siteConfig = defaultSiteConfig.get(site._id, config);

  siteConfig.afterListen = function () {
    apos._id = site._id;
    if (callback) {
      return callback(null, apos);
    }
  };

  const apos = apostrophe(
    _.merge(siteConfig, siteData)
  );

}

module.exports.getDefaultConfig = (options) => {
  return _.merge(defaultSiteConfig.get('default', {}), options);
};

module.exports.getApostropheApp = () => {
  return apostrophe;
};

module.exports.getMultiSiteApp = (options) => {
  app.use(function(req, res, next) {
    /**
     * Start the servers
     */
    req.options = options;
    serveSites(req, res, next);
  });

  return app;
};
