/**
 * The Resource page manages fetching the data from the REST api
 *
 * 2 ways of doing this:
 * 1. Through query params: ?resourceType=idea&resourceId=1
 * 2 Through CMS user configured page settings, like so /idea/1
 */

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
        // in case it's set through resource page type it will be overwritten, before attempting to load the data
        if (req.query.resourceId && req.query.resourceType) {
          req.data.activeResourceId = req.query.resourceId;
          req.data.activeResourceType = req.query.resourceType;

          self.loadResourceData(req, next);
        } else {
          next();
        }
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

      const resourceInfo = resourcesSchema.find((resourceInfo) => resourceInfo.value === req.data.activeResourceType);

      const activeResourceEndpoint = resourceInfo && resourceInfo.resourceEndPoint ? resourceInfo.resourceEndPoint : false;

      var options = {
          uri: `${apiUrl}/api/site/${globalData.siteId}/${activeResourceEndpoint}/${req.data.activeResourceId}?includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1&includeTags=1&includeTargetAudiences=1&includeGrants=1`,
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
          req.data.activeResource = activeResource;

          if (req.data.activeResourceType === 'idea' && req.data.hasModeratorRights) {
            return rp({
                uri: `${apiUrl}/api/site/${req.data.global.siteId}/vote?ideaId=${req.data.activeResourceId}`,
                headers: headers,
                json: true // Automatically parses the JSON string in the response
            })
            .then(function (votes) {
              req.data.ideaVotes = votes;
              return callback(null);
            })
            .catch((e) => {
              return callback(null);
            });
          } else if (req.data.activeResourceType === 'activeUser') {
            return rp({
              uri: `${apiUrl}/api/site/${req.data.global.siteId}/user/${req.data.activeResourceId}/activity`,
              headers: headers,
              json: true // Automatically parses the JSON string in the response
            })
              .then(function (result) {
                const activeResource = req.data.activeResource;
                activeResource.ideas = result && result.ideas ? result.ideas : false;
                activeResource.votes = result && result.votes ? result.votes : false;
                activeResource.arguments = result && result.arguments ? result.arguments : false;
                activeResource.sites = result && result.sites ? result.sites : false;
                activeResource.activity = result && result.activity ? result.activity : false;

                req.data.activeResource = activeResource;
                return callback(null);
              })
              .catch((e) => {
                return callback(null);
              });
          } else {
            callback(null);
          }
        })
        .catch((e) => {
          console.log('erroror', e);

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

      req.data.activeResourceType = req.data.page.type === 'account' ? 'activeUser' : req.data.page.resource;

      // if not logged in user throw a 404 because it needs a url to work
      // for editing that's really annoying
      if (req.data.activeResourceType === 'activeUser') {
      //  req.data.activeResource = req.data.openstadUser;
        req.data.activeResourceId = req.data.openstadUser && req.data.openstadUser.id ? req.data.openstadUser.id : false;
        req.data.activeResourceType = req.data.page.resource;

        return self.fetchResourceData(req, callback);
      } else if (!req.user) {
        req.notFound = true;
        return callback(null);
      } else {
        return callback(null);
      }

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

       const resourceInfo = resourcesSchema.find((resourceInfo) => resourceInfo.value === req.data.activeResourceType);
       req.data.activeResourceEndpoint = resourceInfo.resourceEndPoint;

       self.fetchResourceData(req, callback);
    }
  }
};
