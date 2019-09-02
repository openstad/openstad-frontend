const rp = require('request-promise');

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const getPosterImageUrl = (idea, googleMapsApiKey) => {
      return idea.imageUrl ? idea.imageUrl : idea.location && idea.location && idea.location.coordinates ? 'https://maps.googleapis.com/maps/api/streetview?'+
                           'size=800x600&'+
                           `location=${idea.location.coordinates[0]},${idea.location.coordinates[1]}&`+
                           'heading=151.78&pitch=-0.76&key=' + googleMapsApiKey
                         : null;

}
const enrichIdeas = (ideas, googleMapsApiKey) => {
  return ideas.map((idea) => {
    idea.posterImageUrl = getPosterImageUrl(idea, googleMapsApiKey)
    return idea;
  });
};



const ideas = require('./ideas.json');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea single',
  addFields: [
  //  {
  //    name: 'displayVote',
  //    type: 'string',
  //    label: 'Display vote',
    //  required: true
  //  }
  ],
  construct: function(self, options) {
     let classIdeaId;

     const postVote = (req, res, next) => {
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const siteId = req.data.global.siteId;
       const postUrl = `${apiUrl}/api/site/${siteId}/vote`;

       const votes = req.body.votes ? req.body.votes : [{
         ideaId: req.body.ideaId,
         opinion: req.body.opinion,
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

       console.log('req.body', req.body);
       console.log('roptionsoptionsoptions', options);


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
            console.log('===> voting err', err);
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

     const superPageBeforeSend = self.pageBeforeSend;
     self.pageBeforeSend = (req, callback) => {
       const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
       classIdeaId = ideaId;

       if (ideaId) {
         // req.data.ideas = enrichIdeas(ideas, googleMapsApiKey);
          req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
          req.data.ideaId = ideaId;
       }

       if (ideaId && !req.data.idea) {
  //       res.status(404).end();
         req.res.status(404).json({
           'status': 'Pagina niet gevonden'
         });
       }

       callback();
       return superPageBeforeSend(req, callback);
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
  }
};
