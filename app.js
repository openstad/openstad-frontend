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

app.use(function(req, res, next) {
  /**
   * Start the servers
   */
   serveSites(req, res, next);
});

function serveSites (req, res, next) {
  let thisHost = req.headers['x-forwarded-host'] || req.get('host');

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

        if ((!aposServer[dbName] || forceRestart) && !aposStartingUp[dbName]) {
            //format sitedata so  config values are in the root of the object
            var config = siteConfig.config;
            config.id = siteConfig.id;
            config.title = siteConfig.title;

            aposStartingUp[dbName] = true;

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
              // old schotimeout loop to make sure we dont start multiple servers of the same site
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
    res.status(500).json({ error: 'An error occured checking if the DB exists: ' + e });
  });
}

function run(id, siteData, callback) {
  const site = { _id: id}

  const siteConfig = defaultSiteConfig.get(site, siteData, openstadMap, openstadMapPolygons);

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

app.listen(process.env.PORT);
