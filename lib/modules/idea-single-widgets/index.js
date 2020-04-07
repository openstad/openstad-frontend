const rp = require('request-promise');
const eventEmitter  = require('../../../events').emitter;
const extraFields =  require('../../../config/extraFields.js').fields;
const fields = require('./lib/fields.js');

module.exports = {
  extend: 'map-widgets',
  label: 'Idea single',
  addFields: fields,
  adminOnly: true,
  construct: function(self, options) {
     let classIdeaId;

     require('./lib/routes.js')(self, options);

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

       votes = votes.map((vote) => {
         vote.ipOriginXXX = ip;
         return vote;
       })

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
            res.redirect(req.redirectUrl);
          } else {
            res.end(JSON.stringify({
              id: response.id
            }));
          }
        })
        .catch(function (err) {
            res.status(500).json(err);
         });
     }

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'secondary', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

      const superLoad = self.load;
      self.load = function (req, widgets, next) {
          const styles = self.apos.settings.getOption(req, 'openStadMap').defaults.styles;
          const globalData = req.data.global;
          const siteConfig = req.data.global.siteConfig;
          widgets.forEach((widget) => {
              widget.siteConfig = {
                  minimumYesVotes: (siteConfig && siteConfig.ideas && siteConfig.ideas.minimumYesVotes),
                  voteValues: (siteConfig && siteConfig.votes && siteConfig.votes.voteValues) || [{
                      label: 'voor',
                      value: 'yes'
                  }, {label: 'tegen', value: 'no'}],
              }
              if (widget.siteConfig.minimumYesVotes == null || typeof widget.siteConfig.minimumYesVotes == 'undefined') widget.siteConfig.minimumYesVotes = 100;

              const markerStyle = siteConfig.openStadMap && siteConfig.openStadMap.markerStyle ? siteConfig.openStadMap.markerStyle : null;

              // Todo: refactor this to get ideaId in a different way
              const ideaId = req.url
                  .replace(/(\/.*\/)/, '')
                  .replace(/\?.*/, '');

              const idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
              const ideas = idea ? [idea] : [];

              widget.mapConfig = self.getMapConfigBuilder(globalData)
                  .setDefaultSettings({
                      mapCenterLat: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[0]) || globalData.mapCenterLat,
                      mapCenterLng: (idea && idea.location && idea.location.coordinates && idea.location.coordinates[1]) || globalData.mapCenterLng,
                      mapZoomLevel: 16,
                      zoomControl: true,
                      disableDefaultUI : true,
                      styles: styles
                  })
                  .setMarkersByIdeas(ideas)
                  .setMarkerStyle(markerStyle)
                  .setPolygon(req.data.global.mapPolygons || null)
                  .getConfig()

          });
          return superLoad(req, widgets, next);
      }

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.extraFields = extraFields;
       return superOutput(widget, options);
     };

     self.apos.app.get('/like', (req, res, next) => {
       if (
         req.data.global.siteConfig && req.data.global.siteConfig.votes
         && req.data.global.siteConfig.votes.voteType !== 'likes'
       ) {
         throw Error('GET Route only allowed for vote type like');
       }

       req.body.votes = [{
         ideaId: req.query.ideaId,
         opinion: req.query.opinion,
       }];

       req.redirectUrl = '/' + req.data.global.ideaSlug + '/' + req.query.ideaId;

       postVote(req, res, next);
     });

     self.apos.app.post('/vote', (req, res, next) => {
       postVote(req, res, next);
     });

     const superPageBeforeSend = self.pageBeforeSend;
     console.log();


     self.pageBeforeSend = (req, callback) => {
       const pageData = req.data.page;

       if (req.query.voteOpinion) {
         req.data.formToSubmit = {
           'opinion': req.query.voteOpinion
         }
       }

       callback();
       return superPageBeforeSend(req, callback);
     };
  }
};
