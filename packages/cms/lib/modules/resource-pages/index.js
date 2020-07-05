const rp  = require('request-promise');
const resourcesSchema = require('../../../config/resources.js').schemaFormat;

module.exports = {
  extend: 'apostrophe-custom-pages',
  name: 'resource',
  construct: function(self, options) {

    self.expressMiddleware = {
      when: 'afterRequired',
      middleware: (req, res, next) => {
        // allow for setting the query and resource Id through the query params
        // in case it's set through resource page type it will be overwritten, before attempat to load the data
        if (req.query.resourceId && req.query.resourceType) {
          req.data.activeResourceId = req.query.resourceId;
          req.data.activeResourceType = req.query.resourceType;

          self.loadResourceData(req, next);
        }

        next();
      }
    };

    /*
      Fetch resource data for the
     */
    self.fetchResourceData = (req, callback) => {
      const globalData = req.data.global;
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const appUrl = self.apos.settings.getOption(req, 'appUrl');

      const headers = {
        'Accept': 'application/json',
      };

      if (req.session.jwt) {
        headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
      }

      var options = {
          uri: `${apiUrl}/api/site/${globalData.siteId}/${req.data.activeResourceType}/${req.data.activeResourceId}?includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1`,
          headers: headers,
          json: true // Automatically parses the JSON string in the response
      };

      /**
       * Add the arguments to the resouce object.
       * The rest of the data is already present
       * Also some data is formatted already so we dont overwrite the whole object
       */
      rp(options)
        .then(function (activeResource) {
          console.log('activeResource', activeResource)
          req.data.activeResource = activeResource
          callback(null);
        })
        .catch((e) => {
          console.log('Resource page e', e)

          //if user not logged into CMS in throw 404
          //for ease of use when someone is logged into CMS it's easier to allow
          //editing also when no activeResource is present
          if (!req.user) {
            req.notFound = true;
          }

          callback(null);
        });
    }

    self.dispatch('/', (req, callback) => {

      // if not logged in user throw a 404 because it needs a url to work
      // for editing that's really annoying
      if (!req.user) {
        req.notFound = true;
      } 

      callback(null);
    });

    self.dispatch('/:resourceId', (req, callback) => {
      req.data.activeResourceId = req.params.resourceId;
      req.data.activeResourceType = req.data.page.resource;

      if (req.data.isAdmin && req.data.activeResourceType === 'idea') {
        req.data.ideaVotes = req.data.votes ? req.data.votes.filter(vote => vote.ideaId === parseInt(req.data.activeResourceId,10)) : [];
      }

      self.loadResourceData(req, callback);

    });


    self.loadResourceData = (req, callback) => {
      /**
       * In case of activeUser we load in the active Openstad user
       */
      if (req.data.activeResourceType === 'activeUser') {
        req.data.activeResource = req.data.openstadUser;

        callback(null);
      } else {
        self.fetchResourceData(req, callback);
      }
    }
  }
};
