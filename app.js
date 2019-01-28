require('dotenv').config();

var path = require('path');
var express = require('express');
const apostrophe = require('apostrophe');
const app = express();
const _ = require('lodash');
const mongo = require('mongodb');
const fs = require('fs');
const argv = require('boring')();
const quote = require('shell-quote').quote;
const Promise = require('bluebird');
const dbExists = require('./services/mongo').dbExists;

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

app.use(function(req, res, next) {
  const runner = Promise.promisify(run);
//  const hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host
//  const host = hostname; //req.get('host');
  const thisHost = req.headers['x-forwarded-host'] || req.get('host');
  const host = thisHost === 'localhost:3000' ? 'localhost' : thisHost.replace(/\./g, '');


  dbExists(host)
    .then((exists) => {
      if (exists || thisHost === 'localhost:3000')  {
        if (!aposServer[host]) {
          runner(host, {}).then(function(apos) {
            aposServer[host] = apos;
            aposServer[host].app(req, res);
          });
        } else {
          aposServer[host].app(req, res);
        }
      } else {
        res.status(404).json({ error: 'Not found page or website' });
      }
    })
    .catch((e) => {
      res.status(500).json({ error: 'An error occured checking if the DB exists: ' + e });
    });



//  apos = await runner(options.sites || {});
});


function run(id, config, callback) {
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
        'apostrophe-express': {
          port: process.env.PORT
        },
        'apostrophe-assets' : {
            minify: false,
            scripts: [
            { name: 'jquery-gridder' },
            { name: 'gridder-implementation' }
          ],
          stylesheets: [
            { name: 'gridder' },
            { name: 'idea-list' },
            { name: 'main' }
          ],
        },
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
          // Let's pass in a Google Analytics id, just as an example
          contentWidgets: {
              'apostrophe-images': {},
              'apostrophe-rich-text': {
                toolbar: [ 'Styles', 'Bold', 'Italic', 'Link', 'Unlink' ],
                styles: [
                  { name: 'Heading', element: 'h3' },
                  { name: 'Subheading', element: 'h4' },
                  { name: 'Paragraph', element: 'p' }
                ]
              },
              'card' : {},
              'speech-bubble' : {},
              'button' : {},
              'spacer' : {},
              'title' : {},
              'main-image' : {},
              'list' : {},
              'agenda' : {},
              'idea-overview' : {},
              'idea-single' : {},
              'idea-form' : {},
              'arguments' : {},
              'arguments-form' : {},
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
        'apostrophe-pages': {
          types: [
            {
              name: 'default',
              label: 'Default'
            },
            {
              name: 'home',
              label: 'Home'
            },
          ]
        },
        //    'three-column-widgets': {},
        'one-column-widgets': {},
        'two-column-widgets': {},
        'four-column-widgets': {},
        'three-column-widgets': {},
        'two-third-column-widgets': {},
        'spacer-widgets': {},
        'section-widgets': {},
        'card-widgets': {},
        'iframe-widgets': {},
        'speech-bubble-widgets': {},
        'title-widgets': {},
        'main-image-widgets': {},
        'list-widgets': {},
        'agenda-widgets': {},
        'idea-overview-widgets': {},
        'idea-single-widgets': {},
        'idea-form-widgets': {},
        'arguments-widgets': {},
        'arguments-form-widgets': {},
        'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
      }
    }, config)
  );
}

app.listen(process.env.PORT);
