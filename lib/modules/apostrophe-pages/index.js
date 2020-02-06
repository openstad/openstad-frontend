// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu
const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../services/cache').cache;

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

      //define permission if user can add/edit sections
      self.apos.permissions.add({
        value: 'add-sections',
        label: 'Add sections'
      });

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

      self.setActiveIdeaId = function (req) {
        const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
         if (ideaId) {
            req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
            req.data.ideaId = ideaId;
        }
      }

      self.setEditMode = function (req) {
        req.data.editMode = false;


        console.log('req.session.workflowMode', req.session.workflowMode);

        // in case workflow turn on editmode flag in draft, is used for showing hover lines
        if (req.session.workflowMode && req.session.workflowMode === 'draft') {
          req.data.editMode = true;
        // in case workflow turn on editmode flag in draft, is used for showing hover lines
        } else if (!req.session.workflowMode && req.data.user) {
          req.data.editMode = true;
        }

      }

      const superPageBeforeSend = self.pageBeforeSend;

      self.pageBeforeSend = (req, callback) => {

        self.redirectWhenNotLoggedIn(req, callback);

        self.setActiveIdeaId(req, callback);

        self.setEditMode(req, callback);

        req.data.messages =  {
          success: req.flash('success'),
          error: req.flash('error'),
          info: req.flash('info'),
        }

        return superPageBeforeSend(req, callback);
      };
    }
};
