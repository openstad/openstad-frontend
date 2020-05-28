const rp  = require('request-promise');

module.exports = {
  extend: 'apostrophe-custom-pages',
  name: 'idea',
  construct: function(self, options) {
    self.dispatch('/:ideaId', (req, callback) => {
      req.data.ideaId = req.params.ideaId;
  //    req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(req.data.ideaId, 10)) : null;

      if (req.data.ideaId && !req.data.idea) {
      //  req.notFound = true;
      }

      const globalData = req.data.global;
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const appUrl = self.apos.settings.getOption(req, 'appUrl');
      const headers = {
        'Accept': 'application/json',
      };

      if (req.session.jwt) {
        headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
      }

      if (req.data.hasModeratorRights) {
        req.data.ideaVotes = req.data.votes ? req.data.votes.filter(vote => vote.ideaId === parseInt(req.data.ideaId,10)) : [];
      }

      var options = {
          uri: `${apiUrl}/api/site/${globalData.siteId}/idea/${req.data.ideaId}?includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1&includeTags=1`,
          headers: headers,
          json: true // Automatically parses the JSON string in the response
      };

      /**
       * Add the arguments to the idea object.
       * The rest of the data is already present
       * Also some data is formatted already so we dont overwrite the whole object
       */
      rp(options)
        .then(function (idea) {
          req.data.idea = idea;
          // because we now have dynamic resource widgets and urls, the idea is also called
          // plan is to phase this module out
          req.data.activeResource = idea;
          req.data.activeResourceType = 'idea';

          if (idea.argumentsAgainst) {
            req.data.idea.argumentsAgainst = idea.argumentsAgainst;
          }

          if (idea.argumentsFor) {
            req.data.idea.argumentsFor = idea.argumentsFor;
          }

          req.data.idea.extraData = idea.extraData;
          req.data.idea.user = idea.user;

          callback(null);
        })
        .catch((e) => {
          //if user not logged into CMS in throw 404
          //for ease of use when someone is logged into CMS it's easier to allow
          //editing also when no activeResource is present
          if (!req.user) {
            req.notFound = true;
          }

          callback(null);
        });
    });

  }
};
