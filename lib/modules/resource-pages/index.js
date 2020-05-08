const rp  = require('request-promise');

module.exports = {
  extend: 'apostrophe-custom-pages',
  name: 'resource',
  construct: function(self, options) {
  //self.dispatch('/', self.indexPage);


    self.dispatch('/:resourceId', (req, callback) => {
      req.data.activeResourceId = req.params.resourceId;
      req.data.activeResourceType = req.data.page.resource;

      const globalData = req.data.global;
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const appUrl = self.apos.settings.getOption(req, 'appUrl');
      const headers = {
        'Accept': 'application/json',
      };

      if (req.session.jwt) {
        headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
      }

      if (req.data.hasModeratorRights && req.data.activeResourceType === 'idea') {
          req.data.ideaVotes = req.data.votes ? req.data.votes.filter(vote => vote.ideaId === parseInt(req.data.activeResourceId,10)) : [];
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
          req.data.activeResource = activeResource;
          callback(null);
        })
        .catch((e) => {
          console.log('e', e);

          //if user not logged into CMS in throw 404
          //for ease of use when someone is logged into CMS it's easier to allow
          //editing also when no activeResource is present
          if (!req.user) {
            req.notFound = true;
            callback(null);
          }

          /*
                @TODO render proper 404 when resource not found!
                if (req.data.activeResourceId && !req.data.idea) {

                }
          */
          callback(null);
        });
    });

  }
};
