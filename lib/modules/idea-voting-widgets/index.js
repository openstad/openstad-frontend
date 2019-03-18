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
  label: 'Stemronde',
  addFields: [

  ],
  construct: function(self, options) {

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'jquery.gridder', { when: 'always' });
       self.pushAsset('script', 'ideas-lister', { when: 'always' });
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.userHasVoted = false;
       widget.userIsLoggedIn = false;
       widget.user = {};
       widget.ideas = enrichIdeas(ideas, googleMapsApiKey);

       widget.isAdmin = false;

       return superOutput(widget, options);
     };
  }
};
