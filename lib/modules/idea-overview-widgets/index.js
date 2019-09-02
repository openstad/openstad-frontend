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
      name: 'voting',
      label: 'Enable voting (currently only works with for gridder)',
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
    {
      name: 'step_1_intro',
      label: 'Step 1: intro',
      type: 'string',
      textarea: true,
      def: 'Kies uit onderstaand overzicht jouw favoriete ontwerp voor de muurtekst ‘Zorg goed voor onze stad en voor elkaar’, en vul in de volgende stap je gegevens in.'
    },
    {
      name: 'step_2_intro',
      label: 'Step 2: intro',
      type: 'string',
      textarea: true,
      def: 'Via onderstaande knop kun je op een aparte pagina je e-mailadres invullen. Ter controle krijg je een mail om je e-mailadres te bevestigen. Als dat lukt kom je terug op deze pagina.'
    },
    {
      name: 'step_2_succesfull_auth',
      label: 'Step 2: succesfully authenticated',
      type: 'string',
      textarea: true,
      def: 'Het controleren van je e-mailadres is gelukt!<br/>Je bent bijna klaar. Klik op onderstaande knop om je stem te versturen.'
    },
    {
      name: 'button_authenticating',
      label: 'Text in button for authenticating',
      type: 'string',
      def: 'Vul je e-mailadres in'
    },
    {
      name: 'placeholder_empty_item',
      label: 'Placeholder when no item is selected',
      type: 'string',
      def: 'Kies een ontwerp'
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
        fields: ['gridder_text_open', 'gridder_text_vote_button' ]
      },
      {
        name: 'voting',
        label: 'Voting',
        fields: ['voting' ]
      },
    /*  {
        name: 'text',
        label: 'Text',
        fields: ['text_', 'text_', 'text_' ]
      },*/
    ]);

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'tile', { when: 'always' });
       self.pushAsset('stylesheet', 'grid', { when: 'always' });

       self.pushAsset('stylesheet', 'vote-creator', { when: 'always' });
       self.pushAsset('stylesheet', 'gridder', { when: 'always' });
       self.pushAsset('stylesheet', 'nr-of-votes', { when: 'always' });

       self.pushAsset('script', 'thumbnail-tile-loading', { when: 'always' });
       self.pushAsset('script', 'tabs', { when: 'always' });
       self.pushAsset('script', 'fotorama', { when: 'always' });
       self.pushAsset('script', 'vote', { when: 'always' });
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
