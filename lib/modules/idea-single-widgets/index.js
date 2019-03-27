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
    {
      name: 'displayVote',
      type: 'string',
      label: 'Display vote',
    //  required: true
    }
  ],
/*  construct: function(self, options) {

  /*  self.route('get', 'idea/:ideaId', function(req, res, next) {
      req.data.ideaId = req.params.ideaId;
      next();
    });
*/
/*
    self.pageBeforeSend = function(req, callback) {
      console.log('---->  req.query.id', req.query.id);
      req.data.ideaId = req.query.id;
      return callback(null);
    }
  }*/
  construct: function(self, options) {

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'secondary', { when: 'always' });

    //   self.pushAsset('script', 'sticky', { when: 'always' });
     };

     const superPageBeforeSend = self.pageBeforeSend;

     self.pageBeforeSend = function(req, callback) {
      // req.data.ideas = enrichIdeas(ideas, googleMapsApiKey);
       req.data.idea = req.data.ideas.find(idea => idea.id === parseInt(req.params.id, 10));
       callback()
       return superPageBeforeSend(req, callback);
     };
  }




};
