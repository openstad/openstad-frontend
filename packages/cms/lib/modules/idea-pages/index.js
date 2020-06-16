const rp  = require('request-promise');
const Url = require('url');
const eventEmitter  = require('../../../events').emitter;

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



   self.apos.app.get('/like', (req, res, next) => {
     if (
       req.data.global.siteConfig && req.data.global.siteConfig.votes
       && req.data.global.siteConfig.votes.voteType !== 'likes'
     ) {
       throw Error('GET Route only allowed for vote type like');
     }

     req.body.votes = [{
       ideaId: req.query.ideaId,
       opinion: req.query.opinion ? req.query.opinion : 'yes',
     }];

     req.redirectUrl = req.query.redirectUrl ? req.query.redirectUrl : '/' + req.data.global.ideaSlug + '/' + req.query.ideaId;

     postVote(req, res, next);
   });

   const postVote = (req, res, next) => {
    eventEmitter.emit('vote');

     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const siteId = req.data.global.siteId;
     const postUrl = `${apiUrl}/api/site/${siteId}/vote`;
     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

     let votes = req.body.votes ? req.body.votes : [{
       ideaId: req.body.ideaId,
       opinion: req.body.opinion,
    //   ipOriginXXX: ip // 1111
     }];

     const options = {
         method: 'POST',
         uri: postUrl,
         headers: {
             'Accept': 'application/json',
             "X-Authorization" : `Bearer ${req.session.jwt}`,
         },
         body: votes,
         json: true // Automatically parses the JSON string in the response
     };

     rp(options)
      .then(function (response) {
        if (req.redirectUrl) {
          var redirectUrl = Url.parse(req.redirectUrl);
          redirectUrl = redirectUrl ? redirectUrl.pathname : '/';
          res.redirect(redirectUrl);
        } else {
          res.end(JSON.stringify({
            id: response.id
          }));
        }
      })
      .catch(function (err) {
          console.log(err);

          res.status(500).json(err);
       });
   }


   self.apos.app.post('/vote', (req, res, next) => {
     postVote(req, res, next);
   });

   const superPageBeforeSend = self.pageBeforeSend;

   self.pageBeforeSend = (req, callback) => {
     const pageData = req.data.page;

     if (req.query.voteOpinion && req.query.ideaId) {
       res.redirect(`/like?ideaId=${req.query.ideaId}&opinion=${req.query.voteOpinion}&redirectUrl=${req.data.currentPath}`)
     }

     callback();
     return superPageBeforeSend(req, callback);
   };

  }
};
