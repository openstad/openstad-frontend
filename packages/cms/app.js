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
const express = require('express');
const http2 = require('http2');
const apostrophe = require('apostrophe');
const app = express();
const _ = require('lodash');
const rp = require('request-promise');
const Promise = require('bluebird');
const auth = require('basic-auth');
const compare = require('tsscmp');
const path = require('path');
const morgan = require('morgan');

//internal code
const cdns = require('./services/cdns');
const dbExists = require('./services/mongo').dbExists;
const openstadMap = require('./config/map').default;
const openstadMapPolygons = require('./config/map').polygons;
const defaultSiteConfig = require('./config/siteConfig');
const defaultExtensions = [
  '.jpg',
  '.js',
  '.svg',
  '.png',
  '.less',
  '.gif',
  '.woff',
];
// in case minifying is on the CSS doesn't have to go through ApostropheCMS
// but for development sites it's necessary
const fileExtension =
  process.env.MINIFY_JS === 'ON'
    ? [...defaultExtensions, '.css', '.less']
    : defaultExtensions;

// Storing all site data in the site config
let sites = {};
let sitesResponse = [];
const aposStartingUp = {};
const REFRESH_SITES_INTERVAL = 60000 * 5;

if (process.env.REQUEST_LOGGING === 'ON') {
  app.use(morgan('dev'));
}

const aposServer = {};

app.use(express.static('public'));

app.set('trust proxy', true);

function fetchAllSites(req, res, startSites) {
  const apiUrl = process.env.INTERNAL_API_URL
    ? process.env.INTERNAL_API_URL
    : process.env.API;

  console.log('Fetch all sites');

  if (!process.env.SITE_API_KEY) {
    console.log('Site api key is not set!');
    if (res) res.status(500).json({ error: 'Site api key is not set!' });
    return;
  }

  const siteOptions = {
    uri: `${apiUrl}/api/site`, //,
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'X-Authorization': process.env.SITE_API_KEY,
    },
    json: true, // Automatically parses the JSON string in the response
  };

  return rp(siteOptions)
    .then((response) => {
      sitesResponse = response;
      const newSites = [];

      response.forEach((site, i) => {
        // for convenience and speed we set the domain name as the key
        newSites[site.domain] = site;
      });

      sites = newSites;
      cleanUpSites();
    })
    .catch((e) => {
      console.error('An error occurred fetching the site config:', e);
      if (res)
        res
          .status(500)
          .json({ error: 'An error occured fetching the sites data: ' + e });
    });
}

// run through all sites see if anyone is not active anymore and needs to be shut down
function cleanUpSites() {
  const runningDomains = Object.keys(aposServer);

  if (runningDomains) {
    runningDomains.forEach((runningDomain) => {
      if (!sites[runningDomain]) {
        aposServer[runningDomain].apos.destroy();
        delete aposServer[runningDomain];
      }
    });
  }
}

function serveSite(req, res, siteConfig, forceRestart) {
  const runner = Promise.promisify(run);
  const dbName =
    siteConfig.config && siteConfig.config.cms && siteConfig.config.cms.dbName
      ? siteConfig.config.cms.dbName
      : '';
  const domain = siteConfig.domain;

  // check if the mongodb database exist. The name for databse
  return dbExists(dbName)
    .then((exists) => {
      // if default DB is set
      if (exists || dbName === process.env.DEFAULT_DB) {
        if ((!aposServer[domain] || forceRestart) && !aposStartingUp[domain]) {
          console.log('(Re)Start apos domain, siteId', domain, siteConfig.id);

          //format sitedata so  config values are in the root of the object
          var config = siteConfig.config;
          config.id = siteConfig.id;
          config.title = siteConfig.title;
          config.area = siteConfig.area;
          config.domain = domain;
          config.sitePrefix = siteConfig.sitePrefix;

          aposStartingUp[domain] = true;

          runner(dbName, config, req.options).then(function (apos) {
            aposStartingUp[domain] = false;
            aposServer[domain] = apos;
            aposServer[domain].app.set('trust proxy', true);
            aposServer[domain].app(req, res);
          });
        } else {
          const startServer = (server, req, res) => {
            server.app(req, res);
          };

          const safeStartServer = () => {
            if (aposStartingUp[domain]) {
              // old school timeout loop to make sure we dont start multiple servers of the same site
              setTimeout(() => {
                safeStartServer();
              }, 100);
            } else {
              startServer(aposServer[domain], req, res);
            }
          };

          safeStartServer();
        }
      } else {
        res.status(404).json({ error: 'No Mongo database found for site' });
      }
    })
    .catch((e) => {
      console.error('An error occurred checking if the Mongo DB exists:', e);
      res.status(500).json({
        error: 'An error occured checking if the Mongo DB exists: ' + e,
      });
    });
}

async function run(id, siteData, options, callback) {
  const site = { _id: id };

  let openstadComponentsCdn = await cdns.contructComponentsCdn();
  let openstadReactAdminCdn = await cdns.contructReactAdminCdn();

  const config = _.merge(siteData, options, {
    openstadComponentsCdn,
    openstadReactAdminCdn,
  });

  let assetsIdentifier;

  // for dev sites grab the assetsIdentifier from the first site in order to share assets

  if (Object.keys(aposServer).length > 0) {
    const firstSite = aposServer[Object.keys(aposServer)[0]];
    assetsIdentifier = firstSite.assets.generation;
  }

  const siteConfig = defaultSiteConfig.get(site._id, config, assetsIdentifier);

  siteConfig.afterListen = function () {
    apos._id = site._id;
    if (callback) {
      return callback(null, apos);
    }
  };

  const apos = apostrophe(_.merge(siteConfig, siteData));
}

module.exports.getDefaultConfig = (options) => {
  return _.merge(defaultSiteConfig.get('default', {}), options);
};

module.exports.getApostropheApp = () => {
  return apostrophe;
};

module.exports.getMultiSiteApp = (options) => {
  /**
   * First fetch the data of all sites
   */
  app.use(async function (req, res, next) {
    if (Object.keys(sites).length === 0) {
      console.log('Fetching config for all sites');
      await fetchAllSites(req, res);
    }

    if (Object.keys(sites).length === 0) {
      console.log('No config for sites found');
      res.status(500).json({ error: 'No sites found' });
    }

    // add custom openstad configuration to ApostrhopheCMS
    req.options = options;

    //format domain to our specification
    let domain = req.headers['x-forwarded-host'] || req.get('host');
    domain = domain.replace(['http://', 'https://'], ['']);
    domain = domain.replace(['www'], ['']);

    req.openstadDomain = domain;

    next();
  });

  const resetConfigMw = async (req, res, next) => {
    let host = req.headers['x-forwarded-host'] || req.get('host');
    host = host.replace(['http://', 'https://'], ['']);
    await fetchAllSites(req, res);
    req.forceRestart = true;
    next();
  };

  /**
   * Route for resetting the config of the server
   * Necessary when making changes in the site config
   * Currently simple fetches all config again, and then stops the express server
   */
  app.use('/config-reset', resetConfigMw);
  app.use('/:firstPath/config-reset', resetConfigMw);

  /**
   * Check if a site is running under the first path
   *
   * So for instance, following should work:
   *  openstad.org/site2
   *  openstad.org/site3
   *
   * If not existing openstad.org will handle the above examples as pages,
   * if openstad.org exists of course.
   */
  app.use('/:sitePrefix', function (req, res, next) {
    const domainAndPath = req.openstadDomain + '/' + req.params.sitePrefix;

    const site = sites[domainAndPath] ? sites[domainAndPath] : false;

    if (site) {
      site.sitePrefix = req.params.sitePrefix;
      req.sitePrefix = req.params.sitePrefix;
      req.site = site;

      return express.static('public')(req, res, next);
      // try to run static from subsite
    } else {
      next();
    }
  });

  app.use('/:sitePrefix', function (req, res, next) {
    if (req.site) {
      //console.log('servig')
      return serveSite(req, res, req.site, req.forceRestart);
    }

    next();
  });

  /**
   * Check if the requested domain exists and if so serve the site
   */
  app.use(function (req, res, next) {
    /**
     * Start the servers
     */
    const site = sites[req.openstadDomain] ? sites[req.openstadDomain] : false;

    // if site exists serve it, otherwise give a 404
    if (site) {
      req.site = site;
      serveSite(req, res, site, req.forceRestart);
    } else {
      res.status(404).json({ error: 'Site not found' });
    }
  });

  /**
   * Update the site config every few minutes
   */
  setInterval(fetchAllSites, REFRESH_SITES_INTERVAL);
  return app;
};