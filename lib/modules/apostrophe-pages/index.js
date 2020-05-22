// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu
const _               = require('lodash');
const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const cache           = require('../../../services/cache').cache;
const loadIdeas       = require('./lib/load-ideas');
const loadTags        = require('./lib/load-tags');
const eventEmitter    = require('../../../events').emitter;
const internalApiUrl  = process.env.INTERNAL_API_URL;

module.exports = {
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
        name: 'resource',
        label: 'Resource'
      },
      {
        name: 'home',
        label: 'Home'
      },
    ],
    construct : function (self, options) {
      self.addRankingToIdeas = function (req) {
        let counter = 1;
        req.data.ideas =  req.data.ideas ? req.data.ideas
          .sort((ideaA, ideaB) => {
            return ideaB.yes - ideaA.yes;
          })
          .map((idea) => {
            idea.ranking = counter;
            idea.extraData.ranking = counter;
            counter++;
            return idea;
          }) : [];
      }

      /**
       * Determine if there is an active idea based upon the url query ?=ideaId of params /:ideaId
       */
      self.setActiveIdeaId = function (req) {
        const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
        if (ideaId) {
            if (!req.data.idea) {
              req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
            }
            req.data.ideaId = ideaId;
        }
      }

      /*
      self.apos.app.use((req, res, next) => {
        console.log('req.session', req.session);
        next();
      });
      */

      /**
       * Load in on demand cache on get
       * On demand cache only serves cached pages when the site is on a high load
       * It doesnt serve a cached page when the req.session object isset (except for a few standard keys)
       */
    //  self.apos.app.use(expressCacheOnDemand);

      // set return options to the data object, it's a bit shorter then these long getOption function calls
      self.apos.app.use((req, res, next) => {
        req.data.csrf = self.apos.settings.getOption(req, 'csrf');
        req.data.apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        req.data.appUrl = self.apos.settings.getOption(req, 'appUrl');
        req.data.googleMapsApiKey =  self.apos.settings.getOption(req, 'googleMapsApiKey');
        next();
      });

      // load api resources we want available on every page
      // they are cached
      self.apos.app.use((req, res, next) => { loadIdeas(req, res, next); });
      self.apos.app.use((req, res, next) => { loadTags(req, res, next);  });

      const superPageBeforeSend = self.pageBeforeSend;

      self.pageBeforeSend = (req, callback) => {

        /**
         * Allow pages to redirect if not logged in
         * Redirect in seperate function doesnt block execution flow therefore causing header already set error
         */
        const pageData = req.data.page;

        if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
          return req.res.redirect(pageData.notLoggedInRedirect);
        }

        self.setActiveIdeaId(req);

        self.addRankingToIdeas(req);

        req.data.messages =  {
          success: req.flash('success'),
          error: req.flash('error'),
          info: req.flash('info'),
        }

        return superPageBeforeSend(req, callback);
      };

      /**
       * Add route that clears all cache
       */
      self.apos.app.get('/clear-cache', (req, res, next) => {
        // if user is logged into apostrophe then allow cache reset
        if (req.user) {
          eventEmitter.emit('clearCache');
          return res.redirect(req.header('Referer')  || '/');
        }
      });

      /**
       * Add button to admin menu to clear cache
       */
      self.apos.adminBar.add('openstad-clear-cache', 'Clear Cache')

      /**
       * Add script that handles the clear cache options
       */
      self.pushAsset('script', 'clear-cache', { when: 'always' });

    }
};
