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
  label: 'Ideas',
  addFields: [
    {
      name: 'displayType',
      label: 'Type ',
      type: 'select',
      choices: [
        {
          label: 'Minimum stemmen (stemvan type)',
          value: 'minimalVotes',
        },
        {
          label: 'Uitklap',
          value: 'gridder',
        }
      ]
    },
    {
      name: 'gridder_voting',
      label: 'Enable voting for gridder',
      type: 'boolean'
    },
    {
      name: 'gridder_text_open',
      label: 'Text for hover on image',
      type: 'string'
    },
    {
      name: 'gridder_text_vote_button',
      label: 'Text for voting button',
      type: 'string'
    },
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Algemeen',
        fields: ['displayType']
      },
      {
        name: 'gridder',
        label: 'Uitklapper',
        fields: ['gridder_voting', 'gridder_text_open', 'gridder_text_vote_button' ]
      },
    ]);

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'thumbnail-tile-loading', { when: 'always' });
      // self.pushAsset('script', 'tabs', { when: 'always' });
       self.pushAsset('script', 'fotorama', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.ideas = enrichIdeas(ideas, googleMapsApiKey);

       widget.formatImageUrl = function (url, width, height, crop) {
          url = url + '/:/rs=w:'+ width + ',h:' + height;
          return crop ? url + ';cp=w:' + width + ',h:' + height : url;
       }

       return superOutput(widget, options);
     };

  }
};
