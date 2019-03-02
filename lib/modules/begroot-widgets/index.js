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
    return {
      ...idea,
      posterImageUrl: getPosterImageUrl(idea, googleMapsApiKey)
    }
  });
};

const ideas = require('./ideas.json');


module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Begroot',
  addFields: [
    {
      name: 'phase',
      label: 'Rondes',
      type: 'select',
      choices: [
        {
          label: 'Indienronde',
          value: 'submitting',
        },
        {
          label: 'Stemronde',
          value: 'voting',
        },
        {
          label: 'Afgelopen',
          value: 'finished',
        }
      ]
    },
    {
      name: 'infoMessage',
      type: 'string',
      label: 'Informatie bericht',
      required: true
    }
  ],
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'sticky', { when: 'always' });
       self.pushAsset('script', 'accordion', { when: 'always' });
       self.pushAsset('script', 'jquery.gridder.min', { when: 'always' });
       self.pushAsset('script', 'ideas-gridder-list', { when: 'always' });
       self.pushAsset('script', 'westbegroot', { when: 'always' });
       self.pushAsset('script', 'westbegroot-enhancements', { when: 'always' });
     };

     ideas

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.userHasVoted = false;
       widget.userIsLoggedIn = false;
       widget.ideas = enrichIdeas(ideas, googleMapsApiKey);
       return superOutput(widget, options);
     };
  }
};
