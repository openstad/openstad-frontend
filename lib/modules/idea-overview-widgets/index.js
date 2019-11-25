const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

const merge            = require('lodash.merge');

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

const sortingOptions  = require('../../../config/sorting.js').options;
const ideaStates      = require('../../../config/idea.js').states;

const fields = [
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
        type: 'boolean',
        choices: [
          {
            label: 'Ja',
            value: true,
            showFields: [
						  'vote_block_show_text_1',
						  'vote_block_show_text_2',
					  ]
          },
          {
            label: 'Nee',
            value: false,
          }
        ]
      },
      {
        name: 'showVoteCounter',
        label: 'Show vote counter (for gridder)',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          }
        ]
      },
      {
        name: 'vote_block_show_text_1',
        label: 'Toon dit veld bij een geselcteerde inzending',
        type: 'string'
      },
      {
        name: 'vote_block_show_text_2',
        label: 'Toon dit veld bij een geselcteerde inzending',
        type: 'string'
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
        name: 'gridder_open_text_vote_button',
        label: 'Text for voting button (open)',
        type: 'string'
      },
      {
        name: 'gridder_tile_image_aspect_ratio',
        label: 'Aspect ratio of images in tiles',
        type: 'string',
        def: '1:1',
      },
      {
        name: 'gridder_use_field_as_title',
        label: 'Which field should be used as title for an idea',
        type: 'string',
        def: 'title',
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
        name: 'step_2_succesfull_button',
        label: 'Step 2: succesfull feedback in button',
        type: 'string',
        def: 'Gevalideerd'
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
      {
        name: 'no_selection_error',
        label: 'Error for no selection',
        type: 'string',
        def: 'Je hebt nog geen selectie gemaakt.'
      },
      {
        name: 'success_title',
        label: 'Success title',
        type: 'string',
        def: 'Gelukt, je stem is opgeslagen!'
      },
      {
        name: 'success_message',
        label: 'Success description',
        type: 'string',
        def: 'Bedankt voor het stemmen. Hou deze website<br/> in de gaten voor de uitslag.'
      },
      {
        type: 'checkboxes',
        name: 'selectedSorting',
        label: 'Select sorting available (check one or more)',
        choices: sortingOptions
      },
      {
        type: 'select',
        name: 'defaultSorting',
        label: 'Select the default sorting (needs to be checked)',
        choices: sortingOptions
      },
      {
        type: 'string',
        name: 'filterIdeas',
        label: 'Show only following ideas: (idea id\'s, comma seperated)',
      },
      {
        name: 'displayFilterVoting',
        label: 'Display filter & sorting?',
        type: 'boolean',
        choices: [
          {
            label: 'Yes',
            value: true
          },
          {
            label: 'No',
            value: false,
          }
        ],
        def: true
      },
    ].concat(
      ideaStates.map((state) => {
        return {
          type: 'string',
          name: 'label' +  state.value,
          label: 'Label for: ' + state.value,
        }
      })
  );

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Ideas',
  addFields: fields,
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
        fields: ['gridder_text_open', 'gridder_text_vote_button', 'gridder_open_text_vote_button', 'gridder_tile_image_aspect_ratio', 'gridder_use_field_as_title' ]
      },
      {
        name: 'voting',
        label: 'Voting',
        fields: ['voting', 'showVoteCounter', 'vote_block_show_text_1', 'vote_block_show_text_2', ]
      },
      {
        name: 'sorting',
        label: 'Sorting & filtering',
        fields: ['displayFilterVoting','defaultSorting', 'selectedSorting', 'filterIdeas' ]
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
       self.pushAsset('stylesheet', 'duration', { when: 'always' });

       self.pushAsset('stylesheet', 'vote-creator', { when: 'always' });
       self.pushAsset('stylesheet', 'gridder', { when: 'always' });
       self.pushAsset('stylesheet', 'nr-of-votes', { when: 'always' });
       self.pushAsset('script', 'thumbnail-tile-loading', { when: 'always' });
       self.pushAsset('script', 'tabs', { when: 'always' });
       self.pushAsset('script', 'fotorama', { when: 'always' });
       self.pushAsset('script', 'vote', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
			widgets.forEach((widget) => {
        widget.ideas = req.data.ideas;
				widget.useVoteBlockDescription = req.data.global.siteConfig && req.data.global.siteConfig.votes && req.data.global.siteConfig.votes.minIdeas == 1 && req.data.global.siteConfig.votes.maxIdeas == 1;
				widget.siteConfig = {
          minimumYesVotes: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.minimumYesVotes ),
          voteValues: ( req.data.global.siteConfig && req.data.global.siteConfig.votes && req.data.global.siteConfig.votes.voteValues ) || [{label: 'voor',value: 'yes'},{label: 'tegen',value: 'no'}],
        }
        if (widget.siteConfig.minimumYesVotes == null || typeof widget.siteConfig.minimumYesVotes == 'undefined') widget.siteConfig.minimumYesVotes = 100;
			});
			return superLoad(req, widgets, next);
		}

     const superOutput = self.output;
     self.output = function(widget, options) {
    //   widget.ideas = enrichIdeas(ideas, googleMapsApiKey);

       // add the label to the select sort options for displaying in the select box
       widget.selectedSorting = widget.selectedSorting ? widget.selectedSorting.map((sortingValue) => {
         const sortingOption = sortingOptions.find(sortingOption => sortingOption.value === sortingValue);
         return {
           value: sortingValue,
           label: sortingOption ? sortingOption.label : sortingValue
         }
       }) : [];

       widget.formatImageUrl = function (url, width, height, crop, location) {
         if (url) {
           url = url + '/:/rs=w:'+ width + ',h:' + height;
           url =  crop ? url + ';cp=w:' + width + ',h:' + height : url;
         } else if (location) {
           url = `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${location.coordinates[0]},${location.coordinates[1]}&heading=151.78&key=${googleMapsApiKey}`;
         } else {
           url = '/img/placeholders/idea.jpg';
         }

         return url;
       }

       widget.getTitleText = function (idea, fieldname) {
         fieldname = fieldname || 'title';
         let value = idea;
         fieldname.split('\.').forEach((key) => {
           value = value[key]
         });
         value = value || '';
         return value;
       }

       if (widget.filterIdeas) {
         const ideaIds = widget.filterIdeas.split(',').map(function(item) {
          return parseInt(item.trim(), 10);
        });

         widget.ideas = ideaIds.length > 0 ? widget.ideas.filter(idea => ideaIds.indexOf(idea.id) !== -1) : widget.ideas;
       }

       return superOutput(widget, options);
     };

  }
};
