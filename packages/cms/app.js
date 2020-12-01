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


// Storing all site data in the site config
const sites                   = {};
let sitesRepsonse           = [];
const configForHosts          = {};
const aposStartingUp          = {};
const REFRESH_SITES_INTERVAL  = 60000 * 5;

var aposServer = {};

app.use(express.static('public'));

app.set('trust proxy', true);

/**
 * Route for resetting the config of the server so the server will refetch
 * Necessary when making changes in the site config.
 */
app.get('/config-reset', async (req, res, next) => {
  let host = req.headers['x-forwarded-host'] || req.get('host');
  host = host.replace(['http://', 'https://'], ['']);
  await fetchAllSites(req, res);
  res.json({ message: 'Ok'});
});

function fetchAllSites (req, res, startSites) {
  const apiUrl = process.env.INTERNAL_API_URL ? process.env.INTERNAL_API_URL : process.env.API;

  console.log('Fetch all sites')

  if (!process.env.SITE_API_KEY) {
    console.log('Site api key is not set!');
    if (res) res.status(500).json({ error: 'Site api key is not set!' });
    return;
  }

  const siteOptions = {
      uri:`${apiUrl}/api/site`, //,
      headers: {
          'Accept': 'application/json',
          "Cache-Control": "no-cache",
          "X-Authorization": process.env.SITE_API_KEY
      },
      json: true // Automatically parses the JSON string in the response
  };

  rp(siteOptions)
    .then((response) => {

      sitesRepsonse = response;

      console.log('response', response);

      response.forEach((site, i) => {
        // for convenience and speed we set the domain name as the key
        sites[site.domain] = site;

        if (startSites) {
          serveSite(req, res, site, true);
        }

      });
    }).catch((e) => {
        console.error('An error occurred fetching the site config:', e);
        if (res) res.status(500).json({ error: 'An error occured fetching the sites data: ' + e });
    });
}


async function  serveSites (req, res, next) {
  console.log('serveSites', Object.keys(sites))
  if (Object.keys(sites).length === 0) {
    console.log('await ')
    await fetchAllSites(req, res);
  }

  if (Object.keys(sites).length === 0) {
    res.status(500).json({ error: 'No sites found'});
  }

  let domain = req.headers['x-forwarded-host'] || req.get('host');
  domain = domain.replace(['http://', 'https://'], ['']);
  //
  let domainAndBase = domain + req.baseUrl;

  // first check if domain and base exist, then this will be the site, if no
  const site = sites[domainAndBase] ? sites[domainAndBase]  : sites[domain];

  if (!site) {
    res.status(404).json({ error: 'Site not found'});
  }

  // serve the site
  try {
    serveSite(req, res, site, false);
  } catch (e) {
    console.log('-->> e', e);
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
              aposServer[dbName].app.set('trust proxy', true);
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

  /**
   * Update the siteconfig every few minutes
   */
  setInterval(fetchAllSites, REFRESH_SITES_INTERVAL);
  return app;
};
