// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu
const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../services/cache').cache;
const loadIdeas       = require('./lib/load-ideas');

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
        name: 'home',
        label: 'Home'
      },
    ],
    construct : function (self, options) {
      self.redirectWhenNotLoggedIn = function (req, callback) {
        const pageData = req.data.page;

        if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
          try {
            req.res.redirect(pageData.notLoggedInRedirect );
            return;
          }  catch(e) {
          }
        }
      }

      self.setActiveIdeaId = function (req, callback) {
        const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
         if (ideaId) {
            req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
            req.data.ideaId = ideaId;
        }
      }


      const superPageBeforeSend = self.pageBeforeSend;

      self.pageBeforeSend = (req, callback) => {

        self.redirectWhenNotLoggedIn(req, callback);

        self.setActiveIdeaId(req, callback);

        req.data.messages =  {
          success: req.flash('success'),
          error: req.flash('error'),
          info: req.flash('info'),
        }

        return superPageBeforeSend(req, callback);
      };

      /**
       * Load in the ideas from the api and set to the req object
       */
      self.apos.app.use((req, res, next) => {
        req.data.csrf = self.apos.settings.getOption(req, 'csrf');
        req.data.apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        req.data.appUrl = self.apos.settings.getOption(req, 'appUrl');
        req.data.googleMapsApiKey =  self.apos.settings.getOption(req, 'googleMapsApiKey');
        
        loadIdeas(req, res, next)
      });

    }
};
