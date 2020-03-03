/**
 * This modules handles the request of the single idea pages
 */
const rp  = require('request-promise');

module.exports = {
  extend: 'apostrophe-custom-pages',
  name: 'idea',
  construct: function(self, options) {
    self.dispatch('/:ideaId', (req, callback) => {
      req.data.ideaId = req.params.ideaId;
      req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(req.data.ideaId, 10)) : null;

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

      // For admin user enrich
      if (req.data.hasModeratorRights) {
        req.data.ideaVotes = req.data.votes ? req.data.votes.filter(vote => vote.ideaId === parseInt(req.data.ideaId,10)) : [];
      }

      /**
       * Add the arguments data to the idea object.
       * The rest of the data is already present from the API,
       * but it's to heavy to request all data at once
       */
       var options = {
           uri: `${apiUrl}/api/site/${globalData.siteId}/idea/${req.data.ideaId}?includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1`,
           headers: headers,
           json: true // Automatically parses the JSON string in the response
       };

      rp(options)
        .then(function (idea) {
          if (idea.argumentsAgainst) {
            req.data.idea.argumentsAgainst = idea.argumentsAgainst;
          }

          if (idea.argumentsFor) {
            req.data.idea.argumentsFor = idea.argumentsFor;
          }

          callback(null);
        })
        .catch((e) => {
          console.log('===> e', e);
          callback(null);
        });
    });

  }
};
